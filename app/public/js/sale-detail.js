import {fetchProductById, fetchSaleDetailById, getCookie, getQueryParams} from "./getData.js"

document.addEventListener('DOMContentLoaded', () => {
    initPage()
})

async function initPage()
{
    let params = getQueryParams();
    let saleDetail = await fetchSaleDetailById(params['id']);
    renderItems(saleDetail);
    renderBottom(saleDetail);
    let storedUserShoppingCart = getCookie('shoppingCart');
        if(storedUserShoppingCart != undefined)
            {
                let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
                let shoppingCart = parsedStoredUserShoppingCart;
                renderItemsAmount(shoppingCart.products.length);
            } 
}
//Rendering
function renderItemsAmount(productAmount)
{
    if(productAmount > 0)
        {
            let amountIcon = document.querySelector('.amount-icon');
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }    
}

//CHAT CODE ---------------------------------------------------------------------------------------------------------

async function renderItems(saleDetail) {
    let counter = 0;
    const saleContent = document.querySelector('.sale-detail-content');
    const fragment = document.createDocumentFragment();

    const products = saleDetail.products;

    for (const product of products) {
        try {
            const productData = await fetchProductById(product.productId);
            counter += 1;
            const itemRow = createItemRow(counter, product, productData);
            fragment.appendChild(itemRow);
        } catch (error) {
            console.error(`Failed to fetch product with ID ${product.productId}:`, error);
        }
    }

    saleContent.appendChild(fragment);
}

function createItemRow(counter, product, productData) {
    const itemRow = document.createElement('section');
    itemRow.classList.add('item-row-content');
    itemRow.innerHTML = `
        <p>${counter}</p>
        <p>${productData.name}</p>
        <p>$${formatNumber(product.price)}</p>
        <p>${product.discount}%</p>
        <p>${product.quantity}</p>
        <p>$${formatNumber(product.quantity * product.price)}</p>
    `;
    return itemRow;
}

//CHAT CODE ---------------------------------------------------------------------------------------------------------
function renderBottom(saleDetail)
{
    const SALE_CONTENT = document.querySelector('.sale-detail-bottom');
    let itemRow = document.createElement('section');
    itemRow.classList.add('item-row-bottom')
    itemRow.innerHTML = `<p>Cantidad Total: ${saleDetail.totalQuantity}</p>
        <p>Subtotal: $${formatNumber(saleDetail.subTotal)}</p>
        <p>Descuento Total: $${formatNumber(saleDetail.totalDiscount)}</p>
        <p>Impuestos: ${Math.round((saleDetail.taxes - 1) * 100)}%</p>
        <p>Total: $${formatNumber(saleDetail.totalPay)}</p>`
    SALE_CONTENT.appendChild(itemRow);
}
//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}