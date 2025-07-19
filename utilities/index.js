const buildVehicleDetail = (vehicle) => {
  return `
  <div class="vehicle-detail">
    <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-img" />
    <div class="vehicle-info">
      <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <h2>Price: $${vehicle.inv_price.toLocaleString()}</h2>
      <p><strong>Mileage:</strong> ${vehicle.inv_miles.toLocaleString()} miles</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p>${vehicle.inv_description}</p>
    </div>
  </div>`;
};

module.exports = {
  // other exports…
  buildVehicleDetail,
};
