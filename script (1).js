const products=[
{id:1,name:"Classic Printed T-Shirt",cat:"Clothes",price:699,icon:"👕",sizes:["S","M","L","XL"]},
{id:2,name:"Oversized Graphic Tee",cat:"Clothes",price:799,icon:"👕",sizes:["S","M","L","XL"]},
{id:3,name:"Custom Street Cap",cat:"Caps",price:499,icon:"🧢",sizes:["Standard"]},
{id:4,name:"Signature Print Mug",cat:"Mugs",price:349,icon:"☕",sizes:["Standard"]},
{id:5,name:"Printed Hoodie",cat:"More",price:1199,icon:"🧥",sizes:["S","M","L","XL"]},
{id:6,name:"Custom Tote Bag",cat:"More",price:399,icon:"👜",sizes:["Standard"]},
{id:7,name:"Printed Phone Case",cat:"More",price:299,icon:"📱",sizes:["iPhone","Android"]},
{id:8,name:"Wall Art Poster",cat:"More",price:449,icon:"🖼️",sizes:["A4","A3"]}
];

let cart=JSON.parse(localStorage.getItem("rivoCart")||"[]");
let currentCategory = "All";

function renderProducts(list=products){
 document.getElementById("products").innerHTML=list.map(p=>`
   <article class="product">
     <div class="product-img">${p.icon}</div>
     <div class="product-info">
       <h3>${p.name}</h3>
       <div class="price">₹${p.price.toLocaleString("en-IN")}</div>
       <div class="size-selector">
         <span>Option:</span>
         <select id="size-${p.id}">
           ${p.sizes.map(s=>`<option value="${s}">${s}</option>`).join("")}
         </select>
       </div>
       <button class="add" onclick="addToCart(${p.id})">Add to cart</button>
     </div>
   </article>
 `).join("");
}

function filterProducts(cat){
  currentCategory = cat;
  let list = cat === "All" ? products : products.filter(p => p.cat === cat);
  document.getElementById("searchInput").value = "";
  document.getElementById("sortSelect").value = "default";
  renderProducts(list);
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
}

function handleSearch(){
  const query = document.getElementById("searchInput").value.toLowerCase();
  let list = currentCategory === "All" ? products : products.filter(p => p.cat === currentCategory);
  list = list.filter(p => p.name.toLowerCase().includes(query));
  renderProducts(list);
}

function handleSort(){
  const sortVal = document.getElementById("sortSelect").value;
  let list = [...products];
  if(currentCategory !== "All") list = list.filter(p => p.cat === currentCategory);
  
  if(sortVal === "low-high") list.sort((a,b)=>a.price-b.price);
  if(sortVal === "high-low") list.sort((a,b)=>b.price-a.price);
  if(sortVal === "name") list.sort((a,b)=>a.name.localeCompare(b.name));
  
  renderProducts(list);
}

function addToCart(id){
  const sizeSelect = document.getElementById(`size-${id}`);
  const selectedSize = sizeSelect ? sizeSelect.value : "Standard";
  
  let x = cart.find(i => i.id === id && i.size === selectedSize);
  if(x) {
    x.qty++;
  } else {
    cart.push({id, qty:1, size: selectedSize});
  }
  save();
  showToast();
}

function showToast(){
  const t = document.getElementById("toast");
  t.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(()=>{ t.style.transform = "translateX(-50%) translateY(100px)"; }, 2000);
}

function changeQty(id, size, n){
  let x = cart.find(i => i.id === id && i.size === size);
  if(!x)return;
  x.qty += n;
  if(x.qty <= 0) cart = cart.filter(i => !(i.id === id && i.size === size));
  save();
}

function save(){
  localStorage.setItem("rivoCart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
 const items = document.getElementById("cartItems");
 let total = 0, count = 0;
 if(!cart.length) {
   items.innerHTML = "<p>Your cart is empty.</p>";
 } else {
   items.innerHTML = cart.map(i => {
     let p = products.find(x => x.id === i.id);
     total += p.price * i.qty;
     count += i.qty;
     return `
       <div class="cart-line">
         <div>
           <b>${p.name}</b><br>
           <small style="color:#666">Option: ${i.size}</small><br>
           ₹${p.price} × ${i.qty}
         </div>
         <div class="qty" style="display:flex; align-items:center; gap:5px;">
           <button onclick="changeQty(${p.id}, '${i.size}', -1)">−</button> 
           ${i.qty} 
           <button onclick="changeQty(${p.id}, '${i.size}', 1)">+</button>
         </div>
       </div>`;
   }).join("");
 }
 document.getElementById("cartTotal").textContent = "₹" + total.toLocaleString("en-IN");
 document.getElementById("cartCount").textContent = count;
}

function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("shade").classList.add("open");renderCart();}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("shade").classList.remove("open");}

function openCheckoutModal(){
  if(!cart.length) return alert("Your cart is empty.");
  closeCart();
  document.getElementById("checkoutModal").style.display = "flex";
}
function closeCheckoutModal(){
  document.getElementById("checkoutModal").style.display = "none";
}

function completeOrder(e){
  e.preventDefault();
  const name = document.getElementById("custName").value;
  alert(`Thank you for your order, ${name}! Your custom items will be processed shortly.`);
  cart = [];
  save();
  closeCheckoutModal();
}

renderProducts();
renderCart();
