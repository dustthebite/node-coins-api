function sortCoinsByName(coins) {
    return coins.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  function sortCoinsByCurrency(coins) {
    return coins.sort((a, b) => {
      const currencyA = a.currency.toUpperCase();
      const currencyB = b.currency.toUpperCase();
      if (currencyA < currencyB) {
        return -1;
      }
      if (currencyA > currencyB) {
        return 1;
      }
      return 0;
    });
  }

  
  function sortCoinsByNominal(coins) {
    return coins.sort((a, b) => {
      return a.nominal - b.nominal;
    });
  }

  function sortCoinsByCountry(coins) {
    return coins.sort((a, b) => {
      const countryA = a.country.toUpperCase();
      const countryB = b.country.toUpperCase();
      if (countryA < countryB) {
        return -1;
      }
      if (countryA > countryB) {
        return 1;
      }
      return 0;
    });
  }

  function sortCoinsByMaterial(coins) {
    return coins.sort((a, b) => {
      const materialA = a.material.toUpperCase();
      const materialB = b.material.toUpperCase();
      if (materialA < materialB) {
        return -1;
      }
      if (materialA > materialB) {
        return 1;
      }
      return 0;
    });
  }

  function sortCoinsByDiameter(coins) {
    return coins.sort((a, b) => {
      return a.diameter - b.diameter;
    });
  }
  
  function sortLotsByStartPrice(lots) {
    return lots.sort((a, b) => {
      return a.start_price - b.start_price;
    });
  }

  function sortLotsByCurrentPrice(lots) {
    return lots.sort((a, b) => {
      return a.current_price - b.current_price;
    });
  }

  function sortOffersByPrice(offers) {
    return offers.sort((a, b) => {
      return a.price - b.price;
    });
  }
  
  function sortProductsByPrice(products) {
    return products.sort((a, b) => {
      return a.price - b.price;
    });
  }

  

  
module.exports = {sortCoinsByName, sortCoinsByMaterial, sortCoinsByDiameter, sortCoinsByNominal, sortCoinsByCurrency, sortCoinsByCountry,
                  sortLotsByStartPrice, sortLotsByCurrentPrice, sortOffersByPrice, sortProductsByPrice}