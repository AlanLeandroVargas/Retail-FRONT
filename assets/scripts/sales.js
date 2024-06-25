document.addEventListener('DOMContentLoaded', () => 
    {        
        let storedUserShoppingCart = getCookie('shoppingCart');
        if(storedUserShoppingCart != undefined)
            {
                let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
                shoppingCart = parsedStoredUserShoppingCart;
                renderItemsAmount(shoppingCart.products.length);
            }
        else
        {
            
        }
    })
//Retrieving data
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}
async function fetchSales(from = null, to = null)
{
    try
    {
        const response = await fetch(`http://localhost:5166/api/Sale?from=${from}&to=${to}`);
        if(!response.ok)
            {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        const data = await response.json();
        return data;
    }
    catch
    {
        console.error('Error fetching data:', error);
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
// function renderSaleCards(sales)
// {
//     sales.forEach(sale => {        
//         const SALE_LIST = document.querySelector('.sale-list-container');
//         let saleContainer = document.createElement('section');
//         saleContainer.classList.add('sale-container')

//         let saleTotalContainer = document.createElement('section');
//         saleTotalContainer.classList.add('sale-total-container');
//         saleTotalContainer.innerHTML = "<h4>Total Pagado:</h4>";
//         let totalPayed = document.createElement('h4');
//         totalPayed.innerHTML = "$ " + formatNumber(sale.totalPay);
//         saleTotalContainer.appendChild(totalPayed);
//         saleContainer.appendChild(saleTotalContainer);

//         let saleProductQuantityContainer = document.createElement('section');
//         saleProductQuantityContainer.classList.add('sale-product-quantity-container')
//         saleProductQuantityContainer.innerHTML = "<h4>Cantidad total de productos:</h4>";
//         let totalQuantity = document.createElement('h4');
//         totalQuantity.innerHTML = sale.totalQuantity;
//         saleProductQuantityContainer.appendChild(totalQuantity);
//         saleContainer.appendChild(saleProductQuantityContainer);

//         let saleDateContainer = document.createElement('section');
//         saleDateContainer.classList.add('sale-date-container');
//         saleDateContainer.innerHTML = "<h4>Fecha:</h4>";
//         let date = document.createElement('h4');
//         date.innerHTML = sale.date.slice(0, 10);
//         saleDateContainer.appendChild(date);
//         saleContainer.appendChild(saleDateContainer);  
        
//         let detailButtonContainer = document.createElement('section');
//         detailButtonContainer.classList.add('details-button-container');
//         let detailButton = document.createElement('button');
//         detailButton.innerHTML = "<h4>Ver mas</h4>";
//         detailButton.addEventListener('click', () => {
//             searchSaleDetail(sale.id)
//         })
//         detailButtonContainer.appendChild(detailButton);
//         saleContainer.appendChild(detailButtonContainer);
        
//         SALE_LIST.appendChild(saleContainer);        
//     });
// }


//CHAT CODE

function renderSaleCards(sales) {
    const saleList = document.querySelector('.sale-list-container');
    const fragment = document.createDocumentFragment();

    sales.forEach(sale => {
        const saleContainer = createSaleContainer(sale);
        fragment.appendChild(saleContainer);
    });

    saleList.appendChild(fragment);
}

function createSaleContainer(sale) {
    const saleContainer = document.createElement('section');
    saleContainer.classList.add('sale-container');

    const saleTotalContainer = createSaleTotalContainer(sale.totalPay);
    saleContainer.appendChild(saleTotalContainer);

    const saleProductQuantityContainer = createSaleProductQuantityContainer(sale.totalQuantity);
    saleContainer.appendChild(saleProductQuantityContainer);

    const saleDateContainer = createSaleDateContainer(sale.date);
    saleContainer.appendChild(saleDateContainer);

    const detailButtonContainer = createDetailButtonContainer(sale.id);
    saleContainer.appendChild(detailButtonContainer);

    return saleContainer;
}

function createSaleTotalContainer(totalPay) {
    const saleTotalContainer = document.createElement('section');
    saleTotalContainer.classList.add('sale-total-container');
    saleTotalContainer.innerHTML = "<h4>Total Pagado:</h4>";

    const totalPayed = document.createElement('h4');
    totalPayed.textContent = `$ ${formatNumber(totalPay)}`;
    saleTotalContainer.appendChild(totalPayed);

    return saleTotalContainer;
}

function createSaleProductQuantityContainer(totalQuantity) {
    const saleProductQuantityContainer = document.createElement('section');
    saleProductQuantityContainer.classList.add('sale-product-quantity-container');
    saleProductQuantityContainer.innerHTML = "<h4>Cantidad total de productos:</h4>";

    const totalQuantityElement = document.createElement('h4');
    totalQuantityElement.textContent = totalQuantity;
    saleProductQuantityContainer.appendChild(totalQuantityElement);

    return saleProductQuantityContainer;
}

function createSaleDateContainer(date) {
    const saleDateContainer = document.createElement('section');
    saleDateContainer.classList.add('sale-date-container');
    saleDateContainer.innerHTML = "<h4>Fecha:</h4>";

    const dateElement = document.createElement('h4');
    dateElement.textContent = date.slice(0, 10);
    saleDateContainer.appendChild(dateElement);

    return saleDateContainer;
}

function createDetailButtonContainer(saleId) {
    const detailButtonContainer = document.createElement('section');
    detailButtonContainer.classList.add('details-button-container');

    const detailButton = document.createElement('button');
    detailButton.innerHTML = "<h4>Ver mas</h4>";
    detailButton.addEventListener('click', () => {
        searchSaleDetail(saleId);
    });

    detailButtonContainer.appendChild(detailButton);

    return detailButtonContainer;
}

//CHAT CODE
//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
async function searchSaleDetail(id)
{    
    window.open('./saleDetail.html?id=' + encodeURIComponent(id), '_self');
}
async function searchSales()
{
    toggleSearchBox();
    let from = document.querySelector('#initialDate').value;
    let to = document.querySelector('#finalDate').value;    
    let sales = await fetchSales(from, to);
    renderSaleCards(sales);
}

function toggleSearchBox()
{
    let searchBox = document.querySelector('.search-box');
    searchBox.classList.toggle('search-box-active');
    toggleSaleListSection();
}
function toggleSaleListSection()
{
    let saleListSection = document.querySelector('.sale-list-container');
    saleListSection.classList.toggle('sale-list-container-active');
}