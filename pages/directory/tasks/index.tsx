'use client';

import { useEffect, useMemo, useState, ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';

import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';

import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  Chip,
  Divider,
  Stack,
  TextField,
  Container,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  LinearProgress
} from '@mui/material';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import useDebounce from '../../../hooks/useDebounce';
import SearchTextField from '../../components/searchTextFied';

import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import BrokerCreateForm from './BrokerCreateForm';

// ---------- Broker types ----------
interface Broker {
  _id: string;
  fullName: string; // UI field; BE uses brokerName
  agencyName?: string;
  specialization?: string[];
  location?: { city?: string; state?: string; country?: string };
  serviceProjectNames?: string[];
  rating?: number;
  isVerified?: boolean;
  avgRating?: number;
  website?: string;
  linkedinProfile?: string;
  whatsappNumber?: string;
  email?: string;
  phone?: string;
  experienceYears?: number;
}

// ---------- Edit Broker Dialog ----------
const emptyBroker: Broker = {
  _id: '',
  fullName: '',
  agencyName: '',
  specialization: [],
  location: { city: '', state: '', country: '' },
  serviceProjectNames: [],
  rating: undefined,
  isVerified: false,
  avgRating: undefined,
  website: '',
  linkedinProfile: '',
  whatsappNumber: '',
  email: '',
  phone: '',
  experienceYears: undefined
};

const BrokerEditDialog = ({
  open,
  onClose,
  broker,
  setBroker,
  onSave,
  loading
}: {
  open: boolean;
  onClose: () => void;
  broker: Broker | null;
  setBroker: (b: Broker) => void;
  onSave: () => void;
  loading: boolean;
}) => {
  const b = broker ?? emptyBroker;

  const arrToCSV = (a?: string[]) => (a && a.length ? a.join(', ') : '');
  const [specializationStr, setSpecializationStr] = useState(arrToCSV(b.specialization));
  const [projectsStr, setProjectsStr] = useState(arrToCSV(b.serviceProjectNames));

  useEffect(() => {
    setSpecializationStr(arrToCSV(b.specialization));
    setProjectsStr(arrToCSV(b.serviceProjectNames));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b._id]);

  const parseCSV = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);
  const patch = (p: Partial<Broker>) => setBroker({ ...(b as Broker), ...p });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Edit Broker
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Full Name" value={b.fullName || ''} onChange={(e) => patch({ fullName: e.target.value })} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Agency" value={b.agencyName || ''} onChange={(e) => patch({ agencyName: e.target.value })} fullWidth />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="City" value={b.location?.city || ''} onChange={(e) => patch({ location: { ...(b.location || {}), city: e.target.value } })} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="State" value={b.location?.state || ''} onChange={(e) => patch({ location: { ...(b.location || {}), state: e.target.value } })} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Country" value={b.location?.country || ''} onChange={(e) => patch({ location: { ...(b.location || {}), country: e.target.value } })} fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Specialization (comma-separated)"
              value={specializationStr}
              onChange={(e) => {
                setSpecializationStr(e.target.value);
                patch({ specialization: parseCSV(e.target.value) });
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Projects/Services (comma-separated)"
              value={projectsStr}
              onChange={(e) => {
                setProjectsStr(e.target.value);
                patch({ serviceProjectNames: parseCSV(e.target.value) });
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Email" value={b.email || ''} onChange={(e) => patch({ email: e.target.value })} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" value={b.phone || ''} onChange={(e) => patch({ phone: e.target.value })} fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="LinkedIn URL" value={b.linkedinProfile || ''} onChange={(e) => patch({ linkedinProfile: e.target.value })} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="WhatsApp Number" value={b.whatsappNumber || ''} onChange={(e) => patch({ whatsappNumber: e.target.value })} fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Experience (years)"
              type="number"
              value={b.experienceYears ?? ''}
              onChange={(e) => patch({ experienceYears: e.target.value === '' ? undefined : Number(e.target.value) })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Website" value={b.website || ''} onChange={(e) => patch({ website: e.target.value })} fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Rating"
              type="number"
              inputProps={{ step: '0.1', min: 0, max: 5 }}
              value={b.rating ?? ''}
              onChange={(e) => patch({ rating: e.target.value === '' ? undefined : Number(e.target.value) })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Verified"
              value={b.isVerified ? 'yes' : 'no'}
              onChange={(e) => patch({ isVerified: e.target.value === 'yes' })}
              fullWidth
            >
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={onSave} disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ---------- Main: Broker Overview ----------
const BrokerOverview = ({ role }: { role: string | null }) => {
  // ✅ only brokeradmin can write
  const canWrite = useMemo(() => (role || '').toLowerCase() === 'brokeradmin', [role]);

  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchName, setSearchName] = useState('');
  const [searchAgency, setSearchAgency] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const dName = useDebounce(searchName, 500);
  const dAgency = useDebounce(searchAgency, 500);
  const dCity = useDebounce(searchCity, 500);
  const dEmail = useDebounce(searchEmail, 500);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalCount, setTotalCount] = useState(0);

  // 🔁 trigger re-fetch after create/update
  const [refresh, setRefresh] = useState(0);

  // Set Authorization header (JWT) for all axios calls on mount
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, []);

  useEffect(() => {
    setPage(1);
  }, [dName, dAgency, dCity, dEmail]);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = { page, limit };
        if (dName.trim()) params.fullName = dName.trim();
        if (dAgency.trim()) params.agencyName = dAgency.trim();
        if (dCity.trim()) params.city = dCity.trim();
        if (dEmail.trim()) params.email = dEmail.trim();

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/broker-directory/filter`,
          { params }
        );

        const raw = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        const mapApiToUi = (r: any): Broker => ({
          _id: r._id,
          fullName: r.fullName ?? r.brokerName ?? '',
          agencyName: r.agencyName,
          specialization: r.specialization,
          location: r.location ?? { city: r.city, state: r.state, country: r.country },
          serviceProjectNames: r.serviceProjectNames,
          rating: r.rating,
          isVerified: r.isVerified,
          avgRating: r.avgRating,
          website: r.website,
          linkedinProfile: r.linkedinProfile,
          whatsappNumber: r.whatsappNumber,
          email: r.email,
          phone: r.phone,
          experienceYears: r.experienceYears
        });

        const list: Broker[] = raw.map(mapApiToUi);
        setBrokers(list);

        const tc = typeof res.data?.totalCount === 'number' ? res.data.totalCount : list.length;
        setTotalCount(tc);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [dName, dAgency, dCity, dEmail, page, limit, refresh]);

  const handleClearSearch = (type: 'name' | 'agency' | 'city' | 'email') => {
    if (type === 'name') setSearchName('');
    if (type === 'agency') setSearchAgency('');
    if (type === 'city') setSearchCity('');
    if (type === 'email') setSearchEmail('');
  };

  // ---- Upload Excel handlers ----
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleOpenUpload = () => {
    if (!canWrite) return;
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setOpenUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!canWrite) { setUploadError('Not allowed'); return; }
    if (!selectedFile) { setUploadError('Please select a file'); return; }
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/broker-directory/bulk-upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        }
      );

      setOpenUploadModal(false);
      setSelectedFile(null);
      setRefresh((r) => r + 1);
      setPage(1);
    } catch (err: any) {
      console.error('Bulk upload failed:', err);
      setUploadError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadCsvTemplate = () => {
    const csvHeader =
      'brokerName,agencyName,city,state,country,specialization,serviceProjectNames,email,phone,linkedinProfile,whatsappNumber,experienceYears,website,rating,isVerified\n';
    const blob = new Blob([csvHeader], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broker_directory_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- Edit / Delete ----
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBroker, setEditBroker] = useState<Broker | null>(null);

  const handleEdit = (broker: Broker) => {
    if (!canWrite) return;
    setEditBroker(broker);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canWrite) return;
    if (confirm('Are you sure you want to delete this broker?')) {
      try {
        setLoading(true);
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/broker-directory/delete-directory/${id}`);
        setBrokers((prev) => prev.filter((b) => b._id !== id));
        setTotalCount((prev) => Math.max(prev - 1, 0));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Delete failed!');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!canWrite || !editBroker) return;
    const { _id, fullName, ...rest } = editBroker;
    const payload = { ...rest, brokerName: fullName };

    try {
      setLoading(true);
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/broker-directory/update-directory/${_id}`, payload);
      setBrokers((prev) => prev.map((b) => (b._id === _id ? { ...b, ...payload, fullName } : b)));
      setEditModalOpen(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed!');
    } finally {
      setLoading(false);
      setRefresh((r) => r + 1);
    }
  };

  return (
    <Box sx={{ px: 2, py: 1 }}>
      {loading && (
        <LinearProgress sx={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 1, mb: 1 }} />
      )}

      <Grid container spacing={2}>
        {/* Filter Bar */}
        <Grid item xs={12}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <SearchTextField label="Search by Name" value={searchName} onChange={setSearchName} onClear={() => handleClearSearch('name')} icon="👤" />
            <SearchTextField label="Search by Agency" value={searchAgency} onChange={setSearchAgency} onClear={() => handleClearSearch('agency')} icon="🏢" />
            <SearchTextField label="Search by City" value={searchCity} onChange={setSearchCity} onClear={() => handleClearSearch('city')} icon="📍" />
            <SearchTextField label="Search by Email" value={searchEmail} onChange={setSearchEmail} onClear={() => handleClearSearch('email')} icon="📧" maxWidth={250} />
          </Box>
        </Grid>

        {/* Actions — only for brokeradmin */}
        <Grid item xs={12}>
          {canWrite ? (
            <>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={handleOpenUpload}>
                  Upload Excel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditBroker({} as Broker);
                    setEditModalOpen(true);
                  }}
                >
                  Add Broker
                </Button>
              </Box>

              {/* Add Broker Modal */}
              <Dialog
                open={Boolean(editBroker) && editBroker?._id === undefined && editModalOpen}
                onClose={() => { setEditModalOpen(false); setEditBroker(null); }}
                maxWidth="md"
                fullWidth
                scroll="body"
                PaperProps={{ sx: { borderRadius: 3, background: '#fff' } }}
              >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: 'primary.main' }}>
                  Add Broker
                  <IconButton onClick={() => { setEditModalOpen(false); setEditBroker(null); }}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                  <BrokerCreateForm
                    onSuccess={() => {
                      setEditModalOpen(false);
                      setEditBroker(null);
                      setRefresh((r) => r + 1);
                      setPage(1);
                    }}
                  />
                </DialogContent>
              </Dialog>

              {/* Upload Excel Modal */}
              <Dialog
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
                maxWidth="sm"
                fullWidth
                scroll="body"
                PaperProps={{ sx: { borderRadius: 3, background: '#fff' } }}
              >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: 'primary.main' }}>
                  Upload Excel – Broker Directory
                  <IconButton onClick={() => setOpenUploadModal(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Accepted formats: <strong>.xlsx, .xls, .csv</strong>
                    </Typography>

                    <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ alignSelf: 'flex-start' }}>
                      Choose File
                      <input hidden type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                    </Button>

                    {selectedFile && <Typography variant="body2">Selected: <strong>{selectedFile.name}</strong></Typography>}

                    {uploading && (
                      <Box>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <Typography mt={0.5} variant="caption" color="text.secondary">
                          Uploading… {uploadProgress}%
                        </Typography>
                      </Box>
                    )}

                    {uploadError && (<Typography variant="body2" color="error">{uploadError}</Typography>)}

                    <Divider />

                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">Expected headers (row 1):</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        brokerName, agencyName, city, state, country, specialization, serviceProjectNames, email, phone, linkedinProfile, whatsappNumber, experienceYears, website, rating, isVerified
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        • <strong>specialization</strong> & <strong>serviceProjectNames</strong> comma-separated. • <strong>isVerified</strong>: yes/no or true/false.
                      </Typography>
                    </Stack>

                    <Button variant="text" onClick={downloadCsvTemplate} sx={{ alignSelf: 'flex-start' }}>
                      Download CSV Template
                    </Button>

                    <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                      <Button variant="outlined" onClick={() => setOpenUploadModal(false)}>Cancel</Button>
                      <Button variant="contained" onClick={handleUpload} disabled={!selectedFile || uploading}>
                        {uploading ? 'Uploading…' : 'Upload & Import'}
                      </Button>
                    </Box>
                  </Stack>
                </DialogContent>
              </Dialog>
            </>
          ) : null}
        </Grid>

        {/* Cards */}
        {brokers.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b._id}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.05)', borderColor: '#cbd5e1' }
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: '#2563EB', mr: 2 }}>{b.fullName?.charAt(0)?.toUpperCase() || 'B'}</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#2E3A59', fontWeight: 600 }}>{b.fullName}</Typography>
                  <Typography variant="subtitle2" sx={{ color: '#6B7280' }}>{b.agencyName || 'Independent'}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {(b.location?.city || b.location?.state || b.location?.country) && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Location:</strong> {[b.location?.city, b.location?.state, b.location?.country].filter(Boolean).join(', ')}
                </Typography>
              )}

              {b.specialization?.length ? (
                <>
                  <Typography variant="subtitle2" sx={{ color: '#2E3A59', fontWeight: 500 }} gutterBottom>Specialization:</Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                    {b.specialization.map((s, i) => (<Chip key={i} label={s} size="small" variant="outlined" />))}
                  </Stack>
                </>
              ) : null}

              {b.serviceProjectNames?.length ? (
                <>
                  <Typography variant="subtitle2" sx={{ color: '#2E3A59', fontWeight: 500 }} gutterBottom>Projects:</Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                    {b.serviceProjectNames.map((p, i) => (
                      <Chip key={i} label={p} size="small" variant="outlined"
                        sx={{ color: '#047857', borderColor: '#6EE7B7', backgroundColor: '#ECFDF5', fontWeight: 500 }} />
                    ))}
                  </Stack>
                </>
              ) : null}

              <Box mb={1}>
                {b.email && (<Typography variant="body2" sx={{ color: '#374151', wordBreak: 'break-all' }} gutterBottom><strong>Email:</strong> {b.email}</Typography>)}
                {b.phone && (<Typography variant="body2" sx={{ color: '#374151' }}><strong>Phone:</strong> {b.phone}</Typography>)}
                {b.rating !== undefined && (<Typography variant="body2" sx={{ color: '#374151' }}><strong>Rating:</strong> {b.rating} ⭐ {b.avgRating ? `(avg ${b.avgRating})` : ''}</Typography>)}
                {b.isVerified && (<Typography variant="body2" color="green">Verified ✅</Typography>)}
              </Box>

              {canWrite && (
                <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                  <Chip label="Edit" onClick={() => handleEdit(b)} clickable
                    sx={{ color: '#1D4ED8', borderColor: '#1D4ED8', backgroundColor: '#EEF2FF', '&:hover': { backgroundColor: '#E0E7FF' } }} variant="outlined" />
                  <Chip label="Delete" onClick={() => handleDelete(b._id)} clickable
                    sx={{ color: '#B91C1C', borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', '&:hover': { backgroundColor: '#FEE2E2' } }} variant="outlined" />
                </Box>
              )}
            </Paper>
          </Grid>
        ))}

        {brokers.length === 0 && !loading && (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">No brokers match your search criteria.</Typography>
          </Grid>
        )}

        {totalCount > 0 && (
          <Grid item xs={12} mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Pagination
              count={Math.ceil(totalCount / limit)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': { color: '#2563EB' },
                '& .Mui-selected': { backgroundColor: '#2563EB', color: '#fff', '&:hover': { backgroundColor: '#1E40AF' } }
              }}
            />
            <TextField
              select label="Rows per page" value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value as string, 10)); setPage(1); }}
              size="small"
              sx={{
                width: 150, backgroundColor: '#f9fafb', borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f9fafb',
                  '& fieldset': { borderColor: '#cbd5e1' },
                  '&:hover fieldset': { borderColor: '#94a3b8' },
                  '&.Mui-focused fieldset': { borderColor: '#2563EB' }
                },
                '& .MuiInputLabel-root': { color: '#374151', fontWeight: 500 },
                '& .Mui-focused .MuiInputLabel-root': { color: '#2563EB' }
              }}
            >
              {[6, 9, 12, 15, 20].map((val) => (<MenuItem key={val} value={val}>{val}</MenuItem>))}
            </TextField>
          </Grid>
        )}

        {/* Edit Modal — only for brokeradmin */}
        {canWrite && (
          <BrokerEditDialog
            open={Boolean(editBroker?._id) && editModalOpen}
            onClose={() => setEditModalOpen(false)}
            broker={editBroker}
            setBroker={(data) => setEditBroker(data)}
            onSave={handleSaveChanges}
            loading={loading}
          />
        )}
      </Grid>
    </Box>
  );
};

// ---------- Page wrapper (role via JWT) ----------
type NextPageWithLayout = NextPage & { getLayout?: (page: ReactElement) => ReactNode; };

const BrokerDirectoryPage: NextPageWithLayout = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = (): string | null => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const decoded: any = jwtDecode(token);
        return decoded.role ?? null;
      } catch (err) {
        console.error('❌ JWT Decode Failed:', err);
        return null;
      }
    };
    setRole(getUserRole());
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ backgroundColor: '#e5e7eb', minHeight: '100vh', py: 3 }}>
        <Box borderBottom={1} borderColor="divider" mb={2}></Box>
        <Grid container>
          <Grid item xs={12}>
            <BrokerOverview role={role} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

BrokerDirectoryPage.getLayout = (page: ReactElement) => (<SidebarLayout>{page}</SidebarLayout>);
export default BrokerDirectoryPage;
