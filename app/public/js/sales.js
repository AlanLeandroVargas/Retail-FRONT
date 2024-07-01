import {getCookie, fetchSales} from "./getData.js"

let sales;
let currentIndex = 0;
let currentPage = 1;
let nextItem = 1;
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
async function searchSales()
{
    toggleSearchBox();
    toggleSpinner();
    let from = document.querySelector('#initialDate').value;
    let to = document.querySelector('#finalDate').value;    
    sales = await fetchSales(from, to);
    let salesCopy = [...sales];
    toggleSpinner();    
    if(sales.length == 0)
        {
            noSales();
        }
    else
    {        
        renderSalesContainer(from, to);
        renderSalesContent(salesCopy.slice(currentIndex, 5));
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

function renderItemsAmount(productAmount)
{
    if(productAmount > 0)
        {
            let amountIcon = document.querySelector('.amount-icon');
            amountIcon.style.display = 'flex';
            amountIcon.innerHTML = `<p>${productAmount}</p>`;
        }    
    
}
function renderSalesContainer(from, to)
{
    renderTitle(from, to);
    createSaleContainerHeader();
    createSaleContainerContent();
    createSalePaginationContainer();
    createPaginationCounter();
    createPaginationButtons();
}
function renderSalesContent(sales) {
    const saleContentContainer = document.querySelector('.sale-content-container'); 
    saleContentContainer.innerHTML = "";       
    sales.forEach(sale => {
        createSaleRow(sale);
    });
}
function createSaleContainerContent()
{
    const salesContainer = document.querySelector('.sale-container');
    const saleContentContainer = document.createElement('section');
    saleContentContainer.classList.add('sale-content-container');
    salesContainer.appendChild(saleContentContainer);
}
function createSalePaginationContainer()
{
    const salesContainer = document.querySelector('.sale-container');
    const paginationContainer = document.createElement('section');
    paginationContainer.classList.add('pagination-container');
    salesContainer.appendChild(paginationContainer);    
}
function createPaginationCounter()
{
    const paginationContainer = document.querySelector('.pagination-container');
    const paginationCounter = document.createElement('section');    
    paginationCounter.classList.add('pagination-counter');
    paginationCounter.innerHTML = `Pagina: ${currentPage}`;
    paginationContainer.appendChild(paginationCounter);
}
function updatePaginationCounter()
{
    const paginationCounter = document.querySelector('.pagination-counter');
    paginationCounter.innerHTML = `Pagina: ${currentPage}`;
}
function createPaginationButtons()
{
    const paginationContainer = document.querySelector('.pagination-container');
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('next-btn');
    nextBtn.innerHTML = 'Siguiente';
    nextBtn.addEventListener('click', () => {nextPage()});
    if(sales.length <= 5)
        {
            nextBtn.disabled = true;
        }
    const previousBtn = document.createElement('button');
    previousBtn.classList.add('previous-btn');
    previousBtn.innerHTML = 'Anterior';
    previousBtn.addEventListener('click', () => {previousPage()});
    previousBtn.disabled = true;
    paginationContainer.appendChild(previousBtn);
    paginationContainer.appendChild(nextBtn);
}
function nextPage()
{
    
    const previousBtn = document.querySelector('.previous-btn');
    previousBtn.disabled = false;
    let salesCopy = [...sales];
    currentPage += 1;
    currentIndex += 5;
    nextItem = currentIndex + 1;
    if(sales.length - (currentPage * 5) <= 0)
        {
            const nextBtn = document.querySelector('.next-btn');
            nextBtn.disabled = true;
        }
    renderSalesContent(salesCopy.splice(currentIndex, 5));    
    updatePaginationCounter();
}
function previousPage()
{
    const nextBtn = document.querySelector('.next-btn');
    nextBtn.disabled = false;
    let salesCopy = [...sales];
    currentPage -= 1;
    currentIndex -= 5;
    nextItem = currentIndex + 1;
    if(currentPage == 1)
        {
            const previousBtn = document.querySelector('.previous-btn');
            previousBtn.disabled = true;
        }
    renderSalesContent(salesCopy.splice(currentIndex, 5));
    updatePaginationCounter();
}
function renderTitle(from, to)
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
function createSaleContainerHeader()
{
    const saleContainer = document.querySelector('.sale-container');
    document.querySelector('.sale-list-container').style.display = "block";
    saleContainer.innerHTML = `
        <p class="item">Item</p>
        <p class="date">Fecha de emision</p>
        <p class="quantity">Cantidad total de productos</p>
        <p class="total-pay">Total</p>
        `;
}
function createSaleRow(sale) {
    createSaleRowContent(sale)
    createDetailButtonContainer(sale.id);    
}

function createSaleRowContent(sale)
{           
    
    const saleContentContainer = document.querySelector('.sale-content-container');
    const item = document.createElement('p');
    item.classList.add('item-value');
    item.innerHTML = nextItem;
    nextItem += 1;
    saleContentContainer.appendChild(item);
    const date = document.createElement('p');
    date.classList.add('date-value');
    date.innerHTML = `${sale.date.slice(0, 10)}`;  
    saleContentContainer.appendChild(date);  
    const quantity = document.createElement('p');
    quantity.classList.add('quantity-value');
    quantity.innerHTML = `${sale.totalQuantity}`;
    saleContentContainer.appendChild(quantity);        
    const totalPay = document.createElement('p');
    totalPay.classList.add('total-pay-value');
    totalPay.innerHTML = `$${formatNumber(sale.totalPay)}`;
    saleContentContainer.appendChild(totalPay);
}

function createDetailButtonContainer(saleId) {
    const saleContentContainer = document.querySelector('.sale-content-container');
    const detailButtonContainer = document.createElement('section');
    detailButtonContainer.classList.add('details-button-container');

    const detailButton = document.createElement('button');
    detailButton.innerHTML = "Ver detalle";
    detailButton.addEventListener('click', () => {
        searchSaleDetail(saleId);        
    });

    detailButtonContainer.appendChild(detailButton);
    saleContentContainer.appendChild(detailButtonContainer);    
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
