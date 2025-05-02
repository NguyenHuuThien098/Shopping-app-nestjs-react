import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Box from '@mui/material/Box';
import NoImageIcon from '@mui/icons-material/Image';
import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Cấu trúc dữ liệu sản phẩm
 * Định nghĩa các thuộc tính cần thiết để hiển thị thẻ sản phẩm
 */
interface Product {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  availableQuantity?: number; // Số lượng khả dụng (sau khi trừ trong giỏ hàng)
}

/**
 * Props cho component ProductCard
 */
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

/**
 * Component hiển thị sản phẩm dạng thẻ
 * 
 * Hiển thị thông tin chi tiết sản phẩm với thiết kế trực quan:
 * - Hình ảnh/ảnh đại diện sản phẩm
 * - Tên sản phẩm và mô tả ngắn gọn với xử lý tràn văn bản
 * - Giá và số lượng tồn kho
 * - Nút thêm vào giỏ hàng
 * - Thiết kế responsive thay đổi theo kích thước màn hình
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Kiểm tra sản phẩm có hình ảnh hay không
  const hasImage = Boolean(product.imageUrl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Xác định số lượng còn lại để hiển thị
  const displayQuantity = product.availableQuantity !== undefined ? product.availableQuantity : product.quantity;
  
  return (
    <Card sx={{ 
      maxWidth: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)'
      }
    }}>
      <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Phần hình ảnh sản phẩm hoặc placeholder */}
        {hasImage ? (
          <CardMedia
            component="img"
            height={isMobile ? "150" : "200"}
            image={product.imageUrl}
            alt={product.name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box 
            sx={{ 
              height: isMobile ? 150 : 200, 
              backgroundColor: '#f0f0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <NoImageIcon sx={{ fontSize: isMobile ? 60 : 80, color: '#bdbdbd' }} />
          </Box>
        )}

        {/* Phần thông tin chi tiết sản phẩm */}
        <CardContent sx={{ 
          flexGrow: 1, 
          p: isMobile ? 1.5 : 2,
          '&:last-child': { 
            paddingBottom: isMobile ? 1.5 : 2 
          }
        }}>
          {/* Tên sản phẩm - hiển thị một dòng với xử lý tràn */}
          <Typography 
            gutterBottom 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            noWrap
            sx={{
              fontSize: isMobile ? '0.95rem' : undefined,
              fontWeight: 'bold'
            }}
          >
            {product.name}
          </Typography>

          {/* Mô tả sản phẩm - giới hạn 3 dòng với dấu ... */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              mb: 2,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              lineHeight: isMobile ? '1.3' : '1.43'
            }}
          >
            {product.description || 'Sản phẩm chất lượng cao với những tính năng nổi bật.'}
          </Typography>

          {/* Hiển thị giá sản phẩm */}
          <Typography 
            variant={isMobile ? "subtitle2" : "h6"} 
            color="primary"
            sx={{
              fontSize: isMobile ? '1rem' : undefined,
              fontWeight: 'bold'
            }}
          >
            ${product.unitPrice}
          </Typography>

          {/* Hiển thị tình trạng tồn kho */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography 
              variant="caption" 
              color={displayQuantity > 0 ? "success.main" : "error.main"}
              sx={{ 
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}
            >
              {displayQuantity > 0 ? `Còn hàng: ${displayQuantity}` : "Hết hàng"}
            </Typography>

            {/* Hiển thị tổng số lượng tồn kho gốc nếu có cả hai giá trị */}
            {product.availableQuantity !== undefined && product.availableQuantity !== product.quantity && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: isMobile ? '0.7rem' : '0.75rem'
                }}
              >
                (Tổng: {product.quantity})
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Nút thêm vào giỏ hàng */}
      <CardActions sx={{ padding: isMobile ? 1 : 1.5 }}>
        <Button 
          size={isMobile ? "small" : "medium"} 
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon fontSize={isMobile ? "small" : "medium"} />}
          onClick={() => onAddToCart(product)}
          disabled={displayQuantity <= 0}
          sx={{
            py: isMobile ? 0.5 : 0.75,
            fontSize: isMobile ? '0.75rem' : undefined
          }}
        >
          Thêm vào giỏ
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;