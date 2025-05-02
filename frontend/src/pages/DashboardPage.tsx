import React, { useState, useEffect, useCallback } from 'react';
import { Typography, TextField, InputAdornment, Button, Snackbar, Alert, Pagination, Stack, Badge, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

/**
 * Cấu trúc dữ liệu sản phẩm 
 * Định nghĩa các thuộc tính cần thiết để hiển thị và thêm vào giỏ hàng
 */
interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  availableQuantity?: number; // Số lượng còn có thể mua
  // Add these for compatibility with API response
  Name?: string;
  UnitPrice?: number;
}

/**
 * Trang Dashboard - Trang chính của ứng dụng
 * 
 * Hiển thị danh sách sản phẩm với các chức năng:
 * - Tìm kiếm sản phẩm theo tên
 * - Lưới sản phẩm responsive tự điều chỉnh theo kích thước màn hình
 * - Thông báo thành công khi thêm sản phẩm vào giỏ
 * - Xử lý lỗi khi không thể tải dữ liệu
 * - Phân trang hiển thị sản phẩm
 * - Cập nhật số lượng còn lại khi thêm vào giỏ hàng
 */
const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8); // Hiển thị 8 sản phẩm mỗi trang
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  /**
   * Tải danh sách sản phẩm từ API với bộ lọc và phân trang
   * Xử lý các trường hợp lỗi và chuẩn hóa dữ liệu 
   */
  const loadProducts = useCallback(async () => {
    try {
      // Sử dụng API search với các parameter chuẩn từ BE
      const result = await fetchProducts(
        searchText, // fetchProducts đã cập nhật để dùng nameProduct
        page, 
        pageSize
        // Có thể thêm các tham số tùy chọn như minPrice, maxPrice, inStock, v.v. khi cần
      );
      
      // Convert the normalized data from the service to our component's Product type
      const convertedProducts: Product[] = result.data.map(item => ({
        id: item.id,
        name: item.name || item.Name || '', // Use name if available, otherwise use Name
        unitPrice: item.unitPrice || item.UnitPrice || 0, // Same for price
        quantity: item.quantity || 0,
        description: item.description,
        imageUrl: item.imageUrl
      }));
      
      setProducts(convertedProducts);
      setTotalProducts(result.total);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
      setProducts([]);
      console.error('Lỗi khi tải sản phẩm:', err);
    }
  }, [searchText, page, pageSize]);

  // Tải sản phẩm khi component được tạo và khi các dependency thay đổi
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /**
   * Cập nhật text tìm kiếm khi người dùng nhập
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  /**
   * Kích hoạt tìm kiếm/lọc sản phẩm và reset về trang đầu tiên
   */
  const handleSearch = () => {
    setPage(1); // Reset về trang đầu tiên khi tìm kiếm mới
    loadProducts();
  };

  /**
   * Xử lý thay đổi trang phân trang
   */
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    // loadProducts sẽ được gọi tự động qua useEffect do dependency [page] thay đổi
  };

  /**
   * Tính toán số lượng còn lại sau khi trừ đi sản phẩm trong giỏ hàng
   * Nhưng không thay đổi tổng số lượng tồn kho gốc
   */
  const getAvailableQuantity = (product: Product): number => {
    const cartItem = cartItems.find(item => item.id === product.id && !item.isPurchased);
    return cartItem ? Math.max(0, product.quantity - cartItem.quantity) : product.quantity;
  };

  /**
   * Thêm sản phẩm vào giỏ hàng và hiển thị thông báo xác nhận
   */
  const handleAddToCart = (product: Product) => {
    const availableQuantity = getAvailableQuantity(product);
    
    if (availableQuantity <= 0) {
      setSnackbarMessage(`Sản phẩm ${product.name} đã hết hàng!`);
      setSnackbarOpen(true);
      return;
    }
    
    // QUAN TRỌNG: Thêm sản phẩm với số lượng tồn kho BAN ĐẦU làm giới hạn
    // KHÔNG sử dụng availableQuantity làm stockQuantity
    // Điều này giúp người dùng có thể thêm đến 100% số lượng hàng, không chỉ 35%
    const productWithStock = {
      ...product,
      // Đảm bảo chúng ta sử dụng số lượng gốc làm giới hạn
      stockQuantity: product.quantity 
    };
    
    addToCart(productWithStock);
    
    // Hiển thị thông báo thành công với tên sản phẩm
    setSnackbarMessage(`Đã thêm ${product.name} vào giỏ hàng!`);
    setSnackbarOpen(true);
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header with Cart Icon */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Danh mục sản phẩm
        </Typography>
        <IconButton 
          color="primary" 
          onClick={() => navigate('/cart')} 
          size="large"
          sx={{ 
            bgcolor: 'rgba(25, 118, 210, 0.08)', 
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' }
          }}
        >
          <Badge 
            badgeContent={cartItems.filter(item => !item.isPurchased).length} 
            color="secondary"
            sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem', height: '20px', minWidth: '20px' } }}
          >
            <ShoppingCartIcon fontSize="medium" />
          </Badge>
        </IconButton>
      </Box>

      {/* Thanh tìm kiếm với chức năng tìm kiếm ngay lập tức */}
      <Box sx={{ display: 'flex', mb: 4, maxWidth: 600 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          sx={{ ml: 1 }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* Hiển thị thông báo lỗi */}
      {error && (
        <Typography color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      {/* Hiển thị tổng số kết quả tìm thấy */}
      {!error && products.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <Typography variant="subtitle1">
            Tìm thấy {totalProducts} sản phẩm
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Trang {page}/{totalPages || 1}
          </Typography>
        </Box>
      )}

      {/* Lưới sản phẩm responsive - tự điều chỉnh theo kích thước màn hình */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {products.length > 0 ? (
          products.map((product) => {
            // Tính toán số lượng có thể thêm vào giỏ hàng
            const availableQty = getAvailableQuantity(product);
            
            // Lưu ý: Không thay đổi thuộc tính quantity gốc của sản phẩm
            // Thay vào đó, thêm availableQuantity cho hiển thị
            const productWithAvailableInfo = {
              ...product,
              availableQuantity: availableQty // Thêm thông tin số lượng khả dụng
              // KHÔNG ghi đè quantity gốc nữa
            };
            
            return (
              <Box key={product.id}>
                <ProductCard
                  product={productWithAvailableInfo}
                  onAddToCart={handleAddToCart}
                />
              </Box>
            );
          })
        ) : null}
      </Box>

      {/* Trạng thái rỗng - Không tìm thấy sản phẩm */}
      {!error && products.length === 0 && (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy sản phẩm nào. Vui lòng thử từ khóa khác.
          </Typography>
        </Box>
      )}

      {/* Phần phân trang */}
      {totalPages > 1 && (
        <Stack spacing={2} sx={{ my: 4, display: 'flex', alignItems: 'center' }}>
          <Pagination 
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
          <Typography variant="caption" color="text.secondary">
            Hiển thị {products.length} trong tổng số {totalProducts} sản phẩm
          </Typography>
        </Stack>
      )}

      {/* Thông báo thành công khi thêm vào giỏ hàng */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;