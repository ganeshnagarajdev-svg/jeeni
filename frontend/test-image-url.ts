// Test file to check image URL resolution
import { environment } from '../environments/environment';

function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/assets/placeholder-product.jpg';
  if (path.startsWith('http')) return path;
  return `${environment.mediaUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Test cases
console.log('Test 1 - Relative path with leading slash:');
console.log(getImageUrl('/uploads/640954b6-661c-42c4-99c5-79e1e08eef07.png'));
console.log('Expected: http://localhost:8000/uploads/640954b6-661c-42c4-99c5-79e1e08eef07.png');

console.log('\nTest 2 - Relative path without leading slash:');
console.log(getImageUrl('uploads/640954b6-661c-42c4-99c5-79e1e08eef07.png'));
console.log('Expected: http://localhost:8000/uploads/640954b6-661c-42c4-99c5-79e1e08eef07.png');

console.log('\nTest 3 - Null path:');
console.log(getImageUrl(null));
console.log('Expected: /assets/placeholder-product.jpg');

console.log('\nTest 4 - Full URL:');
console.log(getImageUrl('http://example.com/image.png'));
console.log('Expected: http://example.com/image.png');
