import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const port = 3000;


// Start the server
app.listen(port, () => {
  console.log(__dirname);
  console.log(`Server is running at http://localhost:${port}`);
});
app.use(express.static(__dirname));
app.use(express.json());

// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});
app.get('/product_detail', (req, res) => {
    res.sendFile(__dirname + '/pages/product_detail.html');
});
app.get('/sale_detail', (req, res) => {
  res.sendFile(__dirname + '/pages/sale_detail.html');
});
app.get('/sales', (req, res) => {
  res.sendFile(__dirname + '/pages/sales.html');
});
app.get('/shopping_cart', (req, res) => {
  res.sendFile(__dirname + '/pages/shopping_cart_page.html');
});



