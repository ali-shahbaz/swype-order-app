export const getItemForCart = (item) => {
    const itemObj = {
        LineItemId: 0,
        id: item.itemid,
        itemid: item.itemid,
        itemVariationId: 0,
        itemName: item.name,
        variationName: '',
        imageUrl: item.detailimageurl,
        sellingPrice: item.salesprice,
        retailprice: item.retailprice,
        costprice: item.costprice,
        tax: item.tax,
        taxAmount: item.taxamount,
        quantity: 1,
        discount: 0,
        discountAmount: 0,
        totalTax: item.taxamount,
        total: item.salesprice,
        isCustomItem: 0,
        detailimageurl: item.detailimageurl,
        originalTaxAmount: item.taxamount,
        originalSellingPrice: item.salesprice,
        isSplitItem: false,
        equitySplitCount: 0,
        description: item.description,
        note: '',
        categoryid: item.categoryid,
        categoryname: item.categoryname,
        hasvariations: item.hasvariations,
        hasmodifier: item.hasmodifier,
        modifiers: item.modifiers,
        selectedModifiers: [],
        variations: item.variations,
        extras : 0
    }

    return itemObj;
}