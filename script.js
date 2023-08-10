let productsdom = document.querySelector(".products-center");
let cartitems = document.querySelector(".cart-items");
let carttotal = document.querySelector(".cart-total");
let cartcontent = document.querySelector(".cart-content");
let cartoverlay = document.querySelector(".cart-overlay");
let cartDOM = document.querySelector(".cart");
let cartbtn = document.querySelector(".cart-btn");
let closecartbtn = document.querySelector(".close-cart");
let clearcartbtn = document.querySelector(".clear-cart");
let cart = [];
let buttonsDOM = [];

class Product {
  async getproducts() {
    try {
      let data = await fetch("https://api.escuelajs.co/api/v1/products");
      let response = await data.json();
      for (let i = 0; i < response.length; i++) {
        let id = response[i].id;
        productsdom.innerHTML += `<article class="product">
          <div class="img-container">
            <img src=${response[i].images[1]} alt="prod-1" class="product-img" />
            <button class="bag-btn" data-id=${response[i].id}>
              <i class="fas fa-shopping-cart"></i>add to Cart
            </button>
          </div>
          <h3>${response[i].title}</h3>
          <h4>${response[i].price}</h4>
        </article>`;
      }
      return response; // Return the response
    } catch (error) {
      console.log(error);
    }
  }

  getbagbtns() {
    const btns = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = btns;
    btns.forEach(button => {
      let id = button.dataset.id;
      let incart = cart.find((item) => item.id === id);
      if (incart) {
        button.innerText = "In cart";
        button.disabled = true;
      }
      button.addEventListener("click", async (event) => {
        
        event.target.innerText = "In cart";
        event.target.disabled = true;
      
        const id = button.dataset.id;
      
        const product = Storage.getStoredProducts(id);
      
        if (product) {
          const cartitem = {
            id: id,
            amount: 1,
            price: parseFloat(product.price), // Include the product's price directly
            title: product.title,  // Add the title property
      image: product.images[1]  // Add the image property
          };
      
          cart = [...cart, cartitem];
      
          // storage
          Storage.savecart(cart);
      
          // set cart values
          this.setcartvalues(cart);
          //displaying
    this.displayprod(cartitem);
    this.showcart();
        }
      });
    });
  }
  setcartvalues(cart) {
    let temptotal = 0;
    let itemstotal = 0;
    cart.forEach(item => {
      const product = Storage.getStoredProducts(item.id);

      if (product) {
        temptotal += product.price * item.amount;
        itemstotal += item.amount;
      }
    });
    carttotal.innerText = parseFloat(temptotal.toFixed(2));
    cartitems.innerText = itemstotal;
    
  }
  displayprod(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image}>
      <div>
          <h4>${item.title}</h4>
          <h5>$${item.price}</h5>
          <span class="remove-item" data-id=${item.id}>remove</span>
      </div>
      <div>
          <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
      </div>`;
    cartcontent.appendChild(div);
      }
      showcart(){
        cartoverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
      }
      setupApp(){
cart=Storage.getcart();
this.setcartvalues(cart);
this.populatecart(cart);
cartbtn.addEventListener('click', this.showcart);
closecartbtn.addEventListener('click', this.hidecart);
}
populatecart(){
  cart.forEach(item=>this.displayprod(item));

}
   hidecart(){
    cartoverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
   }  
   cartlogic(){
    clearcartbtn.addEventListener('click',()=>{
      this.clearcart()
    });
    //functiontionality
    cartcontent.addEventListener("click", event=>{
if(event.target.classList.contains("remove-item")){
  let removeitem=event.target;
  let id=removeitem.dataset.id;
  cartcontent.removeChild(removeitem.parentElement.parentElement)
  this.removeitem(id)
}else if(event.target.classList.contains("fa-chevron-up")){
let addamount=event.target;
let id=addamount.dataset.id;
let tempitem=cart.find(item=>item.id===id);
tempitem.amount=tempitem.amount + 1;
Storage.savecart(cart);
this.setcartvalues(cart);
addamount.nextElementSibling.innerText=tempitem.amount;
}else if(event.target.classList.contains("fa-chevron-down")){
  let loweramount=event.target;
  let id=loweramount.dataset.id;
let tempitem=cart.find(item=>item.id===id);
tempitem.amount=tempitem.amount - 1;
if(tempitem.amount > 0){
Storage.savecart(cart);
this.setcartvalues(cart);
loweramount.previousElementSibling.innerText=tempitem.amount;
}else{
  cartcontent.removeChild(loweramount.parentElement.parentElement)
  this.removeitem(id)
}

}
    });

    
   }
   clearcart(){
    let cartitemms=cart.map(item=>item.id);
    cartitemms.forEach(id=>this.removeitem(id));
    console.log(cartcontent.children)
    while(cartcontent.children.length>0){
      cartcontent.removeChild(cartcontent.children[0])
    }
    this.hidecart();
   }
   removeitem(id){
    cart=cart.filter(item=>item.id!==id);
    this.setcartvalues(cart);
    Storage.savecart(cart);
    let button=this.singlebutton(id)
    button.disabled=false;
    button.innerHTML=`<i class="fas fa-shopping-cart"></i>add to cart`
   }
   singlebutton(id){
    return buttonsDOM.find(button=>button.dataset.id)
   }
  }

class Storage {
  static saveprod(response) {
    localStorage.setItem("response", JSON.stringify(response));
  }
 
  static getStoredProducts(id) {
    let response = JSON.parse(localStorage.getItem("response"));
  
    if (response) {
      const product = response.find(product =>product.id.toString() === id.toString());
      return product;
    } else {
      console.log("No response found in local storage.");
      return null;
    }
  }
  
  static savecart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getcart(){
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
  }
}

document.addEventListener("DOMContentLoaded", () => {
 
  const products = new Product();
//setup app
products.setupApp();
  products.getproducts().then(response => {
    Storage.saveprod(response);
  }).then(() => {
    products.getbagbtns();
products.cartlogic()
  });
});
