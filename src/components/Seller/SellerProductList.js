import React, { useEffect, useState } from 'react'
import CustomerLayout from '../Customer/CustomerLayout'
// import { getSellerCategory } from '../../services/customerServices';
import { FiPlus} from 'react-icons/fi';
import { AnimatePresence, motion } from "framer-motion";
import styled from 'styled-components';
// import AddDicountProductModal from './Modal/AddDicountProductModal';
// import ProductStockAvalibility from './Modal/ProductStockAvalibility';
import SellerDataTable from './ReusableComponents/SellerDataTable';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { ListPlus, SquarePen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import ProductDetailModal from './Modal/ProductDetailsModal';

const PageContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const PageHeader = styled.h2`
  color: #1e293b;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '';
    width: 4px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const AddButton = styled(motion.button)`
  background: #005ce6;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover { 
	background: rgb(0, 72, 179);
	border-color: rgba(0, 72, 179, 0.5);
	transform: translateY(-2px);
  }
`;

const SellerProductList = () => {
  const { productList: product, getProductDetailsList } = useCustomerAuth();
  const [selectedProductData, setSelectedProductData] = useState(null);
  // const [showDiscountModal, setShowDiscountModal] = useState(false)
  // const [stockActiveModal, setStockActiveModal] = useState(false)
  const [isDetailOpenModal, setIsDetailOpenModal] = useState(false)
  // const [categoryList, setCategoryList] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  const columns = [
    { key: 'image', title: 'Product', type: 'image', accessor: r => r.image },
    { key: 'product_name', title: 'Product Name', type: 'text' },
    { key: 'selling_price', title: 'Price', type: 'text', accessor: r => `₹${r.selling_price}` },
    { key: 'variation', title: 'Variation', type: 'status', accessor: r => r.variations.length > 0 ,   customLabels: {
    true: 'Yes',
    false: 'No'
  }
 },
    {
      key: 'actions',
      title: 'Actions',
      type: 'actions',
      buttons: [
        {
          label: "View",
          icon: MdOutlineRemoveRedEye,
          onClick: (row) => handleViewProduct(row),
          size: "md",

        }
      ],
      menuItems: [
        {
          label: 'Edit',
          icon: SquarePen,
          onClick: (row) => handleEditProduct(row)
        },
        {
          label: (row) => (row.variations?.length ?? 0) === 0 ? 'Add Variation' : 'Manage Product Variations',
          icon: ListPlus,
          onClick: (row) => handleVariationNavigation(row)
        },
        // {
        //   label: 'Inactive',
        //   icon: Ban,
        //   onClick: (row) => console.log('Delete:', row)
        // }
      ]
    }
  ]

  // const fetchCategoryData = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await getSellerCategory();
  //     // console.log(response);
  //     setCategoryList(response)
  //   } catch (err) {
  //     setError("Failed to fetch data. Please try again.");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
    
  const handleViewProduct = (product) => {
    setSelectedProductData(product);
    setIsDetailOpenModal(true)
  };

  const handleEditProduct = (product) => {
    setSelectedProductData(product);
    navigate("/sellers/editProduct", { state: { productData: product } });
  };

  const handleVariationNavigation = (product) => {
    const hasVariations = product.variations && product.variations.length > 0;
    if (hasVariations) {
      // Navigate to ProductVariationManager with product_code in URL
      navigate(`/sellers/ProductVariationManager?product_code=${product.product_code}`, { state: { productData: product } });
    } else {
      // Navigate to AddVariation for products without variations
      navigate("/sellers/addVariation", { state: { productData: product } });
    }
  };

  useEffect(() => {
    getProductDetailsList();
    // fetchCategoryData();
  }, []);
  return (
    <CustomerLayout>
      <>
        <PageContainer>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>

            <PageHeader>Product List</PageHeader>

            <AddButton
              onClick={() => navigate("/sellers/addProduct")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus />
              Add New Product
            </AddButton>
          </div>


          <SellerDataTable
            columns={columns}
            data={product}
            EmptyMessage="No Product Found"
            filters={{
              search: { placeholder: 'Search by name...', keys: ['product_name'] },
              selects: [
                {
                  id: 'status', label: 'Category', key: 'category',
                  options: Array.from(
                      new Set((product || []).map((p) => p.category)) // Extract unique category names
                    ).map((category) => ({
                      label: category,
                      value: category,
                    })),
                }
              ],
            }}
            pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
          />

        </PageContainer>

        {/* <AnimatePresence>
          {showDiscountModal && (
            <AddDicountProductModal
              // policy={selectedPolicy}
              onClose={() => setShowDiscountModal(false)}
              onSuccess={() => { setShowDiscountModal(false) }}
              product={product}
            />
          )}
        </AnimatePresence> */}

        {/* <AnimatePresence>
          {stockActiveModal && (
            <ProductStockAvalibility
              // policy={selectedPolicy}
              product={product}
              onClose={() => setStockActiveModal(false)}
              onSuccess={() => { setStockActiveModal(false) }}
            />
          )}
        </AnimatePresence> */}

        <AnimatePresence>
          {isDetailOpenModal && (
            <ProductDetailModal
              productData={selectedProductData}
              onClose={() => setIsDetailOpenModal(false)}
            />
          )}
        </AnimatePresence>
      </>
    </CustomerLayout>
  )
}

export default SellerProductList