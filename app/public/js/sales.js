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

//CHAT CODE ---------------------------------------------------------------------------------------------------------

function renderSaleCards(sales) {
    // const saleList = document.querySelector('.sale-list-container');
    // const fragment = document.createDocumentFragment();
    // const saleContainer = document.createElement('section');
    // saleContainer.classList.add('sale-container');
    // saleList.appendChild(saleContainer);
    // fragment.appendChild(saleContainer);
    createSaleContainerHeader()

    sales.forEach(sale => {
        createSaleRow(sale);
        console.log("Here");
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