import {fetchProductById, fetchSaleDetailById, getCookie, getQueryParams} from "./getData.js"

document.addEventListener('DOMContentLoaded', () => {
    initPage()
})

async function initPage()
{
    let params = getQueryParams();
    let saleDetail = await fetchSaleDetailById(params['id']);
    toggleSpinner();
    renderItems(saleDetail);
    renderBottom(saleDetail);
    let storedUserShoppingCart = getCookie('shoppingCart');
        if(storedUserShoppingCart != undefined && storedUserShoppingCart)
            {
                let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
                let shoppingCart = parsedStoredUserShoppingCart;
                renderItemsAmount(shoppingCart.products.length);
            } 
}
function toggleSpinner()
{
    const spinner = document.getElementById('loading-spinner');
    if(spinner.style.display == 'none')
        {
            spinner.style.display = 'flex';
        }
    else
    {
        spinner.style.display = 'none';
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


async function renderItems(saleDetail) {
    let counter = 0;
    const saleContent = document.querySelector('.sale-detail-content');
    const fragment = document.createDocumentFragment();

    const products = saleDetail.products;

    if(products.length == 1)
        {
            const main = document.querySelector('main');
            main.style.height = '50vh';
        }
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
    let discount = product.quantity * (product.price * (product.discount / 100));
    let subTotal = (product.price * product.quantity) - discount;
    itemRow.classList.add('item-row-content');
    itemRow.innerHTML = `
        <p class="product-item">${counter}</p>
        <p class="product-name truncated">${productData.name}</p>
        <p class="product-quantity">${product.quantity}</p>
        <p class="product-price">$${formatNumber(product.price)}</p>
        <p class="product-discount">${product.discount}%</p>
        <p class="product-price-discounted">$${formatNumber(discount)}</p>
        <p class="product-subtotal">$${formatNumber(subTotal)}</p>
    `;
    return itemRow;
}

function renderBottom(saleDetail)
{
    const saleBottom = document.querySelector('.sale-detail-bottom');
    saleBottom.innerHTML = `
        <p class="row-name">Cantidad Total: </p>
        <p class="value">${saleDetail.totalQuantity}</p>
        <p class="row-name">Descuento Total: </p>
        <p class="value">$${formatNumber(saleDetail.totalDiscount)}</p>
        <p class="row-name">Subtotal: </p>        
        <p class="value">$${formatNumber(saleDetail.subTotal)}</p>
        <p class="row-name">Impuestos: </p>
        <p class="value">${Math.round((saleDetail.taxes - 1) * 100)}%</p>
        <p class="row-name">Total: </p>
        <p class="value"><b>$${formatNumber(saleDetail.totalPay)}<b></p>`;
    saleBottom.appendChild(itemRow);
}
//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}