const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  const token = btn.parentNode.querySelector('[name=_csrf').value;
  const prodElem = btn.closest('article');
   
  fetch(`/admin/product/${prodId}`,{
    method: "DELETE",
    headers: {
      'csrf-token': token
    }
  })
  .then(result => {
    return result.json();
  })
  .then(data => {
    console.log(data);
    prodElem.parentNode.removeChild(prodElem);
  })
  .catch(err => {
    console.log(err);
  });
};