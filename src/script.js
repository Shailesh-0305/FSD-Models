document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let quantity = document.getElementById("quantity").value;

    if (name.trim() === "" || phone.trim() === "" || quantity < 1) {
        alert("Please enter valid details");
        return;
    }

    document.getElementById("message").innerHTML =
        "Order confirmed successfully!";
});