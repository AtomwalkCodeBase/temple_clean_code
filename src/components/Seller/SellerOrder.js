import React from 'react'
import CustomerLayout from '../Customer/CustomerLayout'
import DataTable from '../Admin/AdminLayout/DataTable'
import SellerDataTable from './ReusableComponents/SellerDataTable';
import styled from 'styled-components';

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

const SellerOrder = () => {

  // const orderColumns = [
  //   {
  //     key: "order_id",
  //     title: "Order ID",
  //     render: (value) => <strong>{value}</strong>,
  //   },
  //   {
  //     key: "customer_name",
  //     title: "Customer",
  //   },
  //   {
  //     key: "product_name",
  //     title: "Product",
  //   },
  //   {
  //     key: "total_amount",
  //     title: "Total Amount",
  //   },
  //   {
  //     key: "status",
  //     title: "Status",
  //     render: (value) => {
  //       const statusStyles = {
  //         Delivered: {
  //           color: "#059669",
  //           background: "#d1fae5",
  //         },
  //         Pending: {
  //           color: "#b45309",
  //           background: "#fef3c7",
  //         },
  //         Cancelled: {
  //           color: "#dc2626",
  //           background: "#fee2e2",
  //         },
  //         Processing: {
  //           color: "#2563eb",
  //           background: "#dbeafe",
  //         },
  //       };

  //       const { color, background } = statusStyles[value] || {
  //         color: "#374151",
  //         background: "#f3f4f6",
  //       };

  //       return (
  //         <span
  //           style={{
  //             fontSize: "0.75rem",
  //             color,
  //             background,
  //             padding: "0.125rem 0.5rem",
  //             borderRadius: "9999px",
  //             marginTop: "0.25rem",
  //             display: "inline-block",
  //             fontWeight: "600",
  //           }}
  //         >
  //           {value}
  //         </span>
  //       );
  //     },
  //   },
  //   {
  //     key: "date",
  //     title: "Order Date",
  //   },
  // ];

  const orderColumns = [
  {
    key: "order_id",
    title: "Order ID",
    render: (value) => <strong>{value}</strong>,
  },
  {
    key: "customer_name",
    title: "Customer",
  },
  {
    key: "product_name",
    title: "Product",
  },
  {
    key: "total_amount",
    title: "Total Amount",
  },
  {
    key: "status",
    title: "Status",
    type: "status",
    // render: (value) => {
    //   const statusStyles = {
    //     Delivered: {
    //       color: "#059669",
    //       background: "#d1fae5",
    //     },
    //     Pending: {
    //       color: "#b45309",
    //       background: "#fef3c7",
    //     },
    //     Cancelled: {
    //       color: "#dc2626",
    //       background: "#fee2e2",
    //     },
    //     Processing: {
    //       color: "#2563eb",
    //       background: "#dbeafe",
    //     },
    //   };

    //   const { color, background } = statusStyles[value] || {
    //     color: "#374151",
    //     background: "#f3f4f6",
    //   };

    //   return (
    //     <span
    //       style={{
    //         fontSize: "0.75rem",
    //         color,
    //         background,
    //         padding: "0.125rem 0.5rem",
    //         borderRadius: "9999px",
    //         marginTop: "0.25rem",
    //         display: "inline-block",
    //         fontWeight: "600",
    //       }}
    //     >
    //       {value}
    //     </span>
    //   );
    // },
  },
  {
    key: "date",
    title: "Order Date",
  },
];

  return (
    <CustomerLayout>
       <PageContainer>
      
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
      
                  <PageHeader>Order List</PageHeader>
      
                  {/* <AddButton
                    onClick={() => navigate("/sellers/addProduct")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlus />
                    Add New Product
                  </AddButton> */}
                </div>
        {/* <DataTable
       spiritual={true}
            data={orders}
            columns={orderColumns}
            loading={false}
            pagination={true}
            onEdit={(order) => console.log("Edit order:", order)}
            onDelete={(order) => console.log("Delete order:", order)}
            emptyIcon="📦"
            emptyTitle="No Orders Found"
            emptyDescription="Once customers start ordering, you’ll see them listed here."
            /> */}
             <SellerDataTable
            columns={orderColumns}
            data={[]}
            EmptyMessage="No Orders Found"
            filters={{
              search: { placeholder: 'Search by name or SKU...', keys: ['product_name', 'sku'] },
              selects: [
                {
                  id: 'status', label: 'Status', key: 'status', options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Pending', value: 'pending' }
                  ]
                }
              ],
            }}
            pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
          />

          </PageContainer>


    </CustomerLayout>
  )
}

export default SellerOrder

export const orders = [
  {
    id: 1,
    order_id: "ORD-1001",
    customer_name: "John Doe",
    product_name: "Ghee",
    total_amount: "₹120.00",
    status: "Delivered",
    date: "2025-10-01",
  },
  {
    id: 2,
    order_id: "ORD-1002",
    customer_name: "Emily Clark",
    product_name: "Diya",
    total_amount: "₹250.00",
    status: "Pending",
    date: "2025-10-02",
  },
  {
    id: 3,
    order_id: "ORD-1003",
    customer_name: "Michael Smith",
    product_name: "Agarbatti",
    total_amount: "₹75.00",
    status: "Cancelled",
    date: "2025-10-03",
  },
  {
    id: 4,
    order_id: "ORD-1004",
    customer_name: "Sophia Brown",
    product_name: "Flower",
    total_amount: "₹95.00",
    status: "Processing",
    date: "2025-10-05",
  },
  {
    id: 5,
    order_id: "ORD-1005",
    customer_name: "Liam Johnson",
    product_name: "Sindoor",
    total_amount: "₹450.00",
    status: "Delivered",
    date: "2025-10-06",
  },
];