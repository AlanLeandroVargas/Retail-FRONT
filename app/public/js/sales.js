import {getCookie, fetchSales} from "./getData.js"

document.addEventListener('DOMContentLoaded', () => 
    {        
        initPage();
    })

function initPage()
{
    let storedUserShoppingCart = getCookie('shoppingCart');
    if(storedUserShoppingCart != undefined && storedUserShoppingCart)
        {
            let parsedStoredUserShoppingCart = JSON.parse(storedUserShoppingCart); 
            let shoppingCart = parsedStoredUserShoppingCart;
            renderItemsAmount(shoppingCart.products.length);
        }  
    const searchBtn = document.getElementById('search-btn');
    searchBtn.addEventListener('click', () =>
        {
            searchSales();
        });
    toggleSpinner();
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

function renderSaleCards(sales, from, to) {
    createTitle(from, to)
    createSaleContainerHeader()
    sales.forEach(sale => {
        createSaleRow(sale);
    });
}

function createSaleRow(sale) {
    createSaleListContainerContent(sale)
    createDetailButtonContainer(sale.id);    
}

function createSaleContainerHeader()
{
    const saleContainer = document.querySelector('.sale-container');
    document.querySelector('.sale-list-container').style.display = "block";
    console.log(saleContainer);
    saleContainer.innerHTML = `
        <p class="date">Fecha de emision</p>
        <p class="quantity">Cantidad total de productos</p>
        <p class="total-pay">Total</p>
        `;
}
function createTitle(from, to)
{
    const saleSection = document.querySelector('.sales-section');
    const title = document.createElement('section');
    title.classList.add('title');    
    title.innerHTML = selectTitle(from, to);
    saleSection.prepend(title);
}
function selectTitle(from, to)
{
    if(from == "" && to == "")
        {
            return `<h1>Todas las ventas</h1>`;
        }
    if(from == "")
        {
            return `<h1>Ventas hasta &nbsp ${to}</h1>`;
        }
    if(to == "")
        {
            return `<h1>Ventas desde &nbsp ${from}</h1>`;
        }    
    return `<h1>Ventas desde &nbsp ${from} &nbsp hasta &nbsp ${to}</h1>`
}
function createSaleListContainerContent(sale)
{           
    const saleContainer = document.querySelector('.sale-container');
    let date = document.createElement('p');
    date.classList.add('date-value');
    date.innerHTML = `${sale.date.slice(0, 10)}`;  
    saleContainer.appendChild(date);  
    let quantity = document.createElement('p');
    quantity.classList.add('quantity-value');
    quantity.innerHTML = `${sale.totalQuantity}`;
    saleContainer.appendChild(quantity);        
    let totalPay = document.createElement('p');
    totalPay.classList.add('total-pay-value');
    totalPay.innerHTML = `$${formatNumber(sale.totalPay)}`;
    saleContainer.appendChild(totalPay);
}

function createDetailButtonContainer(saleId) {
    const saleContainer = document.querySelector('.sale-container');
    const detailButtonContainer = document.createElement('section');
    detailButtonContainer.classList.add('details-button-container');

    const detailButton = document.createElement('button');
    detailButton.innerHTML = "<h4>Ver detalle</h4>";
    detailButton.addEventListener('click', () => {
        searchSaleDetail(saleId);        
    });

    detailButtonContainer.appendChild(detailButton);
    saleContainer.appendChild(detailButtonContainer);    
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

//Functionality
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}
async function searchSaleDetail(id)
{    
    window.open('./sale_detail?id=' + encodeURIComponent(id), '_self');
}
async function searchSales()
{
    toggleSearchBox();
    toggleSpinner();
    let from = document.querySelector('#initialDate').value;
    let to = document.querySelector('#finalDate').value;    
    let sales = await fetchSales(from, to);
    toggleSpinner();
    if(sales.length == 0)
        {
            noSales();
        }
    else
    {        
        renderSaleCards(sales, from, to);
    }
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

function noSales()
{
    const saleSection = document.querySelector('.sales-section');
    const noSales = document.createElement('section');
    const main = document.querySelector('main');
    main.style.height = '50vh';
    noSales.classList.add('no-sales');
    noSales.innerHTML = "<p>No se han encontrado ventas dentro de esas fechas</p>";
    noSales.appendChild(noSalesButton());
    saleSection.appendChild(noSales);
}

function noSalesButton()
{
    const button = document.createElement('button');
    button.addEventListener('click', () =>
        {
            window.open('/sales', '_self');
        })
    button.innerHTML = 'Volver a buscar ventas';
    return button;
}