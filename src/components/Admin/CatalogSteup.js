import React, { useState, useEffect, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, X, Edit2, Trash2, Info, SquarePen } from 'lucide-react';
import styled from 'styled-components';
import { getSellerCategory, getVariationList, processCategoryData, processVariationName } from '../../services/customerServices';
import { ImageUploader } from '../Seller/ReusableComponents/ImageUploader';
import { toast } from 'react-toastify';
import SellerDataTable from '../Seller/ReusableComponents/SellerDataTable';

// Styled Components
const Container = styled.div`
  padding: 1.5rem;
  / * max-width: 1200px; */
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
  }
  p {
    color: #6b7280;
    font-size: 0.95rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 16px;
  color: ${({ active }) => (active ? '#2563eb' : '#6b7280')};
  border: 2px solid ${({ active }) => (active ? '#2563eb' : 'transparent')};
  border-radius: 10px 10px 0px 0px;
  background: none;

  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #2563eb;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 0.8rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  input,
  select,
  textarea {
    padding: 0.65rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    transition: border 0.2s;
    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }
  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant }) =>
    variant === 'success'
      ? `
    background: #10b981;
    color: white;
    border: none;
    &:hover { background: #059669; }
  `
      : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    &:hover { background: #f9fafb; }
  `}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    background: #f9fafb;
  }
  td {
    padding: 1rem;
    border-top: 1px solid #f3f4f6;
  }
  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: ${({ variant }) => (variant === 'edit' ? '#eff6ff' : '#fef2f2')};
  color: ${({ variant }) => (variant === 'edit' ? '#2563eb' : '#dc2626')};
  transition: 0.2s;
  &:hover {
    background: ${({ variant }) => (variant === 'edit' ? '#dbeafe' : '#fee2e2')};
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ active }) => (active ? '#d1fae5' : '#fee2e2')};
  color: ${({ active }) => (active ? '#065f46' : '#991b1b')};
`;

const VariationInput = styled.input`
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.95rem;
`;

const VariationTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.35rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  button {
    background: none;
    border: none;
    color: #1d4ed8;
    cursor: pointer;
  }
`;

const InfoBox = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: #eff6ff;
  border-radius: 0.5rem;
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #1e40af;
  code {
    background: white;
    padding: 0.15rem 0.35rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }
`;

// ImageUploader Wrapper (reusable)
const ImageUploaderWrapper = ({ image, onChange, label }) => (
  <FormGroup>
    <label>{label}</label>
    <ImageUploader
      images={image ? [image] : []}
      onChange={(updater) => {
        const updated = updater(image ? [image] : []);
        const imgObj = updated[0];
        onChange(imgObj?.file ? imgObj.file : imgObj?.url || '');
      }}
      max={1}
      activeImage={image}
      setActiveImage={onChange}
      uniqueId={label.toLowerCase().replace(/\s+/g, '-')}
    />
  </FormGroup>
);

// Form Reducer
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.field]: action.value };
    case 'SET_IMAGE':
      return { ...state, image: action.value };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
};

// Main Component
const CatalogSetup = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Category Form
  const [catState, catDispatch] = useReducer(formReducer, {
    id: null,
    name: '',
    description: '',
    status: true,
    image: null,
    gst_applicable: 'N',         // 'Y' | 'N'
    discount_applicable: 'N',    // 'Y' | 'N'
    HSN_SAC_code: '',
    tax_rate: '',
    category_alias: '',
  });

  // Variation Form
  const [varState, varDispatch] = useReducer(formReducer, {
    id: null,
    name: '',
    description: '',
    image: null,
    v_list: [],
  });

  const [valueInput, setValueInput] = useState('');

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, vars] = await Promise.all([getSellerCategory(), getVariationList()]);
      setCategories(cats);
      setVariations(vars);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Category
  const saveCategory = async () => {
    if (!catState.name.trim()) return;

    const formData = new FormData();
    formData.append('name', catState.name);
    formData.append('call_mode', catState.id ? 'UPDATE' : 'ADD');
    formData.append('description', catState.description);
    formData.append('is_active', catState.status ? 'True' : 'False');
    formData.append('is_active', catState.status ? 'True' : 'False');
    formData.append('gst_applicable', catState.gst_applicable ?? 'N');
    formData.append('discount_applicable', catState.discount_applicable ?? 'N');
    formData.append('HSN_SAC_code', catState.HSN_SAC_code ?? '');
    formData.append('tax_rate', catState.tax_rate ?? '');
    formData.append('category_alias', catState.category_alias ?? '');
    if (catState.id) formData.append('category_id', catState.id);
    if (catState.image &&  catState.image instanceof File) {
      formData.append('image', catState.image);
    }

    try {
      // await processCategoryData(formData);
      console.log('API Payload:', Object.fromEntries(formData));
      toast.success(catState.id ? 'Updated!' : 'Added!');
      fetchData();
      catDispatch({ type: 'RESET', payload: {  id: null, name: '', description: '', status: true, image: '', gst_applicable: 'N', discount_applicable: 'N', HSN_SAC_code: '', tax_rate: '', category_alias: '', } });
    } catch {
      toast.error('Save failed');
    }
  };

  // Save Variation
  const saveVariation = async () => {
    console.log(varState)
    if (!varState.name.trim() || varState.v_list.length === 0) return;

    const formData = new FormData();
    formData.append('name', varState.name);
    formData.append('call_mode', varState.id ? 'UPDATE' : 'ADD');
    formData.append('description', varState.description);
    formData.append("v_list_data",varState.v_list.map(([key, label]) => label || key).join("|"));

   if (varState.image && varState.image instanceof File) {
  formData.append("image", varState.image);
}
    if (varState.id) formData.append('variation_id', varState.id);

    try {
      await processVariationName(formData);
      console.log('API Payload:', Object.fromEntries(formData));
      toast.success('Variation saved!');
      fetchData();
      varDispatch({ type: 'RESET', payload: { id: null, name: '', description: '', image: '', v_list: [] } });
      setValueInput('');
    } catch {
      toast.error('Save failed');
    }
  };

  // Handle variation input
  const handleValueEnter = (e) => {
    if (e.key === 'Enter' && valueInput.trim()) {
      const values = valueInput.split('|').map(v => v.trim()).filter(Boolean);
      const tags = values.map(v => [v, v]);
      varDispatch({ type: 'SET', field: 'v_list', value: [...varState.v_list, ...tags] });
      setValueInput('');
    }
  };

  const removeTag = (idx) => {
    varDispatch({
      type: 'SET',
      field: 'v_list',
      value: varState.v_list.filter((_, i) => i !== idx),
    });
  };

  const cancelEdit = () => {
    catDispatch({ type: 'RESET', payload: { id: null, name: '', description: '', status: true, image: '' } });
    varDispatch({ type: 'RESET', payload: { id: null, name: '', description: '', image: '', v_list: [] } });
    setValueInput('');
  };

    const CategoryColumns = [
    { key: 'image', title: 'IMAGE', type: 'image', accessor: r => r.image },
    { key: 'name', title: 'NAME', type: 'text' },
    { key: 'gst_applicable', title: 'GST APPLICABLE', type: 'status', accessor: r => r.gst_applicable },
    { key: 'tax_rate', title: 'TAX', type: 'text', accessor: r => r.tax_rate },
    { key: 'is_active', title: 'STATUS', type: 'status', accessor: r => r.is_active },
    {
      key: 'actions',
      title: 'Actions',
      type: 'actions',
      buttons: [
        {
      label: "edit",
      icon: SquarePen,
      onClick: (row) => catDispatch({
        type: 'RESET',
        payload: { ...row, image: row.image || '' }
      }),
      size: "md",
      onlyIcon: true
    }
      ],
    }
  ]
    const VariationColumns = [
    { key: 'image', title: 'IMAGE', type: 'image', accessor: r => r.image },
    { key: 'name', title: 'NAME', type: 'text' },
    { 
        key: 'variations', 
        title: 'VARIATIONS', 
        type: 'custom',
        accessor: r => r.v_list || [],
        render: (row) => (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(row.v_list || []).map(([k, l], i) => (
                    <span
                        key={i}
                        style={{
                            fontSize: '0.75rem',
                            background: '#f3f4f6',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.375rem',
                        }}
                    >
                        {l || k}
                    </span>
                ))}
            </div>
        )
    },
    // { key: 'is_active', title: 'STATUS', type: 'status', accessor: r => r.is_active },
    {
      key: 'actions',
      title: 'Actions',
      type: 'actions',
      buttons: [
        {
      label: "edit",
      icon: SquarePen,
      onClick: (row) => varDispatch({
        type: 'RESET',
      payload: {
        id: row.id ?? null,
        name: row.name ?? '',
        description: row.description ?? '',
        // ----> SAFE DEFAULTS <----
        status: row.is_active === 'Y' || row.is_active === true,   // boolean
        image: row.image ?? '',
        // any extra fields you may have (gst, tax_rate, …)
        gst_applicable: row.gst_applicable ?? 'N',
        tax_rate: row.tax_rate ?? '',
      },
      }),
      size: "md",
      onlyIcon: true
    }
      ],
    }
  ]

  return (
    <Container>
      <Header>
        <h1>Product Management</h1>
        <p>Manage product categories and variations</p>
      </Header>

      <Tabs>
        {['categories', 'variations'].map(tab => (
          <TabButton
            key={tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </TabButton>
        ))}
      </Tabs>

      <AnimatePresence mode="wait">
        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Form */}
            <Card
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CardHeader>
                <h2>
                  <Plus size={20} />
                  {catState.id ? 'Edit Category' : 'Add New Category'}
                </h2>
              </CardHeader>
              <div style={{ padding: '1.5rem' }}>
                <FormGrid>
                  <FormGroup>
                    <label>Category Name *</label>
                    <input
                      placeholder="e.g., Electronics"
                      value={catState.name}
                      onChange={e => catDispatch({ type: 'SET', field: 'name', value: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Status</label>
                    <select
                      value={catState.status}
                      onChange={e => catDispatch({ type: 'SET', field: 'status', value: e.target.value === 'True' })}
                    >
                      <option value="True">Active</option>
                      <option value="False">Inactive</option>
                    </select>
                  </FormGroup>
                </FormGrid>
                <FormGrid>
                 <FormGroup>
                    <label>Category Alias</label>
                    <input
                      placeholder="Optional alias / slug"
                      value={catState.category_alias}
                      onChange={e => catDispatch({ type: 'SET', field: 'category_alias', value: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>HSN / SAC Code</label>
                    <input
                      placeholder="e.g., 1234 or 9987"
                      value={catState.HSN_SAC_code}
                      onChange={e => catDispatch({ type: 'SET', field: 'HSN_SAC_code', value: e.target.value })}
                    />
                  </FormGroup>

                  </FormGrid>

                  <FormGrid>

                  <FormGroup>
                    <label>Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 18"
                      value={catState.tax_rate}
                      onChange={e => catDispatch({ type: 'SET', field: 'tax_rate', value: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>GST Applicable</label>
                    <select
                      value={catState.gst_applicable}
                      onChange={e => catDispatch({ type: 'SET', field: 'gst_applicable', value: e.target.value })}
                    >
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>
                  </FormGroup>
                </FormGrid>

                  <FormGroup>
                    <label>Discount Applicable</label>
                    <select
                      value={catState.discount_applicable}
                      onChange={e => catDispatch({ type: 'SET', field: 'discount_applicable', value: e.target.value })}
                    >
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>
                  </FormGroup>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <label>Description</label>
                  <textarea
                    placeholder="Describe this category..."
                    value={catState.description}
                    onChange={e => catDispatch({ type: 'SET', field: 'description', value: e.target.value })}
                  />
                </FormGroup>

                <ImageUploaderWrapper
                  label="Variation Image"
                  image={varState.image}
                  onChange={file => varDispatch({ type: 'SET_IMAGE', value: file })}
                />

                <ButtonGroup>
                  {catState.id && (
                    <Button onClick={cancelEdit}>
                      <X size={16} /> Cancel
                    </Button>
                  )}
                  <Button variant="success" onClick={saveCategory}>
                    <Save size={16} /> {catState.id ? 'Update' : 'Save'}
                  </Button>
                </ButtonGroup>
              </div>
            </Card>

            {/* Category List */}
            <Card>
              <CardHeader>
                <h2>Category List</h2>
              </CardHeader>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
              ) : categories.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                  No categories yet. Add one above.
                </div>
              ) : (
                <SellerDataTable
                  columns={CategoryColumns}
                  data={categories}
                  filters={{
                    search: { placeholder: 'Search by name or SKU...', keys: ['product_name', 'sku'] },
                    selects: [
                      {
                        id: 'status', label: 'Status', key: 'is_active', options: [
                          { label: 'Active', value: 'true' },
                          { label: 'Inactive', value: 'false' },
                          // { label: 'Pending', value: 'pending' }
                        ]
                      }
                    ],
                  }}
                  pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
                />
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'variations' && (
          <motion.div
            key="variations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Variation Form */}
            <Card>
              <CardHeader>
                <h2>
                  <Plus size={20} />
                  {varState.id ? 'Edit Variation' : 'Add New Variation'}
                </h2>
              </CardHeader>
              <div style={{ padding: '1.5rem' }}>
                <FormGrid>
                  <FormGroup>
                    <label>Variation Name *</label>
                    <input
                      placeholder="e.g., Size, Color"
                      value={varState.name}
                      onChange={e => varDispatch({ type: 'SET', field: 'name', value: e.target.value })}
                    />
                  </FormGroup>
                  <ImageUploaderWrapper
                    label="Variation Image"
                    image={varState.image}
                    onChange={file => varDispatch({ type: 'SET_IMAGE', value: file })}
                  />
                </FormGrid>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <label>Description</label>
                  <textarea
                    placeholder="Describe this variation..."
                    value={varState.description}
                    onChange={e => varDispatch({ type: 'SET', field: 'description', value: e.target.value })}
                  />
                </FormGroup>

                <FormGroup style={{ marginTop: '1rem' }}>
                  <label>Variation Values *</label>
                  <VariationInput
                    placeholder="Type S|M|L and press Enter"
                    value={valueInput}
                    onChange={e => setValueInput(e.target.value)}
                    onKeyUp={handleValueEnter}
                  />
                  <VariationTags>
                    {varState.v_list.map(([k, l],i ) => (
                      <Tag key={i}>
                        {l || k}
                        <button onClick={() => removeTag(i)}>
                          <X size={14} />
                        </button>
                      </Tag>
                    ))}
                  </VariationTags>
                  <InfoBox>
                    <Info size={18} />
                    <div>
                      <strong>Tip:</strong> Use <code>|</code> to separate values. Example:{' '}
                      <code>Red|Blue|Green</code> and press enter
                    </div>
                  </InfoBox>
                </FormGroup>

                <ButtonGroup>
                  {varState.id && (
                    <Button onClick={cancelEdit}>
                      <X size={16} /> Cancel
                    </Button>
                  )}
                  <Button variant="success" onClick={saveVariation}>
                    <Save size={16} /> {varState.id ? 'Update' : 'Save'}
                  </Button>
                </ButtonGroup>
              </div>
            </Card>

            {/* Variation List */}
            <Card>
              <CardHeader>
                <h2>Variation List</h2>
              </CardHeader>
              {variations.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                  No variations yet. Add one above.
                </div>
              ) : (
                <SellerDataTable
                  columns={VariationColumns}
                  data={variations}
                    filters={{
                      search: {
                        placeholder: 'Search by variation name...', keys: (item) => {
                          const baseKeys = ['name', "v_list"];
                          // Add flattened v_list values as searchable keys
                          const vListValues = (item.v_list || []).flat().map(String);
                          return [...baseKeys, ...vListValues];
                        }
                      },
                    selects: [
                      {
                        id: 'status', label: 'Status', key: 'is_active', options: [
                          { label: 'Active', value: 'true' },
                          { label: 'Inactive', value: 'false' },
                          // { label: 'Pending', value: 'pending' }
                        ]
                      }
                    ],
                  }}
                  pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
                />
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default CatalogSetup;