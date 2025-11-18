import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, Edit2, Image } from 'lucide-react';
import CustomerLayout from '../Customer/CustomerLayout';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getProductDetailList, getVariationList } from '../../services/customerServices';
import { toast } from 'react-toastify';
import { ProductInfoCard } from './ReusableComponents/ProductInfoCard';

// Theme
const theme = {
    gradient: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
    bgGradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.14))",
    hoverGradient: "linear-gradient(145deg, #764ba2, #7c3aed)",
    background: "#F9FAFB",
    white: "#FFFFFF",
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: ${theme.background};
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  background: ${theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
`;

const Card = styled(motion.div)`
  background: ${theme.white};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${theme.background};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Thead = styled.thead`
  background: ${theme.bgGradient};
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid ${theme.background};
  }
`;

const Tbody = styled.tbody`
  tr {
    border-bottom: 1px solid ${theme.background};
    transition: all 0.2s;
    
    &:hover {
      background: ${theme.bgGradient};
    }
  }
  
  td {
    padding: 1rem;
    color: #111827;
    vertical-align: middle;
  }
`;

const Badge = styled.span`
  background: ${theme.gradient};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const ValueCell = styled.td`
  font-weight: 500;
  color: #374151;
`;

const PriceCell = styled.td`
  font-weight: 600;
  color: #059669;
`;

const DiscountCell = styled.td`
  font-weight: 600;
  color: #dc2626;
`;

const ImageCountCell = styled.td`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid ${theme.background};
`;

const VariationActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${theme.background};
`;

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
  background: ${props => props.$variant === 'primary' ? theme.gradient : '#f3f4f6'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#374151'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(118, 75, 162, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const AddVariationCard = styled(motion.div)`
  background: ${theme.white};
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    border-color: #764ba2;
    background: ${theme.bgGradient};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

const ProductInfo = styled.div`
  background: ${theme.white};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProductTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const ProductCode = styled.span`
  display: inline-block;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

/**
 * ProductVariationManager Component
 * 
 * Features:
 * - Fetches product details by product_code from URL
 * - Displays all variations in separate cards, one per variation type
 * - Each variation card has "Edit" and "Update Images" buttons
 * - Edit button navigates to AddVariation Step 1 for that specific variation
 * - Update Images button navigates to AddVariation Step 2 for that specific variation
 * - Allows adding new variations
 */
export default function ProductVariationManager() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const productCodeFromUrl = searchParams.get('product_code');

    // Get product_code from URL or state
    const productCode = productCodeFromUrl || location.state?.productData?.product_code;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [variationList, setVariationList] = useState([]);

    /**
     * Fetch product details by product_code
     * Refreshes when productCode changes
     */
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productCode) {
                // If no product_code, try to use productData from state
                const stateProduct = location.state?.productData;
                if (stateProduct) {
                    setProduct(stateProduct);
                    setLoading(false);
                    return;
                }
                toast.error('Product code is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const productData = await getProductDetailList('product_code', productCode);
                // API might return array or single object
                const product = Array.isArray(productData.data) ? productData.data[0] : productData.data;
                if (product) {
                    setProduct(product);
                } else {
                    toast.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productCode, location.state?.productData]);

    /**
     * Fetch variation list for adding new variations
     */
    useEffect(() => {
        const fetchVariations = async () => {
            try {
                const response = await getVariationList();
                setVariationList(response || []);
            } catch (error) {
                console.error('Error fetching variation list:', error);
            }
        };
        fetchVariations();
    }, []);

    /**
     * Handle Edit button click for a specific variation
     * Navigate to AddVariation Step 1 with the variation pre-populated
     */
    const handleEdit = (variationId) => {
        navigate('/sellers/editVariation', {
            state: {
                productData: product,
                mode: 'edit',
                selectedVariationIds: [variationId],
                step: 1 // Start at Step 1
            }
        });
    };

    /**
     * Handle Image Update button click for a specific variation
     * Navigate to AddVariation Step 2 directly
     */
    const handleImageUpdate = (variationId) => {
        navigate('/sellers/editVariation', {
            state: {
                productData: product,
                mode: 'image_update',
                selectedVariationIds: [variationId],
                step: 2 // Start directly at Step 2
            }
        });
    };

    /**
     * Handle Add New Variation button click
     * Navigate to AddVariation Step 1 in ADD mode
     */
    const handleAddNewVariation = () => {
        navigate('/sellers/addVariation', {
            state: {
                productData: product,
                mode: 'add_new',
                step: 1 // Start at Step 1 in ADD mode
            }
        });
    };

    if (loading) {
        return (
            <CustomerLayout>
                <Container>
                    <LoadingState>Loading product details...</LoadingState>
                </Container>
            </CustomerLayout>
        );
    }

    if (!product) {
        return (
            <CustomerLayout>
                <Container>
                    <EmptyState>
                        <h3>Product not found</h3>
                        <p>Please check the product code and try again</p>
                    </EmptyState>
                </Container>
            </CustomerLayout>
        );
    }

    const hasVariations = product.variations && product.variations.length > 0;

  const orderedVariations = hasVariations
       ? [...product.variations].sort((a, b) => (b.is_primary_one ? 1 : 0) - (a.is_primary_one ? 1 : 0))
       : [];

    return (
        <CustomerLayout>
            <Container>
                <Header>
                    <Title>Manage Product Variations</Title>
                    <Subtitle>Edit variations or update images for each variation type</Subtitle>
                </Header>

                {/* Product Info */}
                <ProductInfo>
                    {/* <ProductTitle>{product.product_name}</ProductTitle>
                    <ProductCode>{product.product_code}</ProductCode> */}
                    <ProductInfoCard productData={product} />
                </ProductInfo>

                {/* Variations Table */}
                {hasVariations ? (
                      orderedVariations.map((variation, varIndex) => {
                        const variationValues = variation.product_variations || [];

                        return (
                            <Card key={variation.id}>
                                <CardHeader>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>
                                        {variation.name}
                                        {variation.is_primary_one && (
                                            <Badge>Primary</Badge>
                                        )}
                                        <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#6b7280', fontWeight: 400 }}>
                                            ({variationValues.length} {variationValues.length === 1 ? 'value' : 'values'})
                                        </span>
                                    </h3>
                                </CardHeader>
                                <div style={{ overflowX: 'auto' }}>
                                    <Table>
                                        <Thead>
                                            <tr>
                                                <th>Value</th>
                                                <th>Additional Price</th>
                                                <th>Discount (%)</th>
                                                <th>Images</th>
                                                <th>Status</th>
                                            </tr>
                                        </Thead>
                                        <Tbody>
                                            {variationValues.map((pv, valueIndex) => {
                                                const imageCount = pv.c_images?.length || 0;
                                                const isActive = pv.is_active !== false;

                                                return (
                                                    <tr key={pv.id}>
                                                        <ValueCell>{pv.value}</ValueCell>
                                                        <PriceCell>
                                                            {pv.additional_price > 0 ? `+₹${parseFloat(pv.additional_price).toFixed(2)}` : '₹0.00'}
                                                        </PriceCell>
                                                        <DiscountCell>
                                                            {pv.discount > 0 ? `${pv.discount}%` : '0%'}
                                                        </DiscountCell>
                                                        <ImageCountCell>
                                                            <Image size={16} />
                                                            <span>{imageCount} {imageCount === 1 ? 'image' : 'images'}</span>
                                                        </ImageCountCell>
                                                        <td>
                                                            <span style={{
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '12px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                background: isActive ? '#d1fae5' : '#fee2e2',
                                                                color: isActive ? '#065f46' : '#991b1b'
                                                            }}>
                                                                {isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </Tbody>
                                    </Table>
                                </div>
                                {/* Action Buttons for this variation */}
                                <VariationActionButtons>
                                    <ActionButton
                                        $variant="primary"
                                        onClick={() => handleEdit(variation.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Edit2 size={18} />
                                        Edit
                                    </ActionButton>
                                    {variation.is_primary_one && (
                                    <ActionButton
                                        onClick={() => handleImageUpdate(variation.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Image size={18} />
                                        Update Images
                                    </ActionButton>
                                    )}
                                </VariationActionButtons>
                            </Card>
                        );
                    })
                ) : (
                    <EmptyState>
                        <h3>No variations configured</h3>
                        <p>Add your first product variation to get started</p>
                    </EmptyState>
                )}

                {/* Add New Variation Button */}
                <AddVariationCard
                    onClick={handleAddNewVariation}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <Plus size={24} color="#764ba2" />
                    <div style={{ marginTop: '0.5rem', fontWeight: 600, color: '#374151' }}>
                        Add New Variation
                    </div>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {/* Add a new variation type or new values to existing variations */}
                        Add a new variation type in the existing product
                    </div>
                </AddVariationCard>
            </Container>
        </CustomerLayout>
    );
}
