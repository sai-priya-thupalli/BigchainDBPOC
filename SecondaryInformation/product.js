const express = require('express');
const router = express.Router();
const index = require('./index');
var moment = require('moment')

// Create a product
router.post('/', async (req, res) => {
  try {
    const { address, city, state, zipcode, policyRole } = req.body;
    console.log('1');
    const productId = await index.createProduct(address, city, state, zipcode, policyRole);
    console.log('2');
    res.status(200).json({ message: 'Product created', productId });
    console.log(productId);
    console.log('3');
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product' });
  }
});

router.post('/data', async (req, res) => {
  try {
    var firstMoment = moment();
    const records = req.body;
    const batchSize = 1000;
    count = 0;

    try{

      for(let i = 0; i < records.length; i += batchSize){
        const batch = records.slice(i, i + batchSize);
        await processEachBatch(batch);
      }
      res.status(200).json('Data insertion completed');
      var secondMoment = moment();
      var timeDifference = secondMoment.diff(firstMoment, 'seconds')
      console.log('Number of records inserted:',count);
      console.log('Time taken to upload the data in seconds', timeDifference);

    } catch (error) {
      console.error('error: ',error);
      res.status(500).json('Error while processing the data');
    }
    

    async function processEachBatch(batch) {
        for (const item of batch) {
        const { address, city, state, zipcode, policyRole } = item;
        const productIds = await index.createProduct(address, city, state, zipcode, policyRole);
        count++;
        console.log(count, ':',productIds);
      }
      
    }
  } catch (error) {
    res.status(500).json('Error processing');
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await index.getProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get product' });
  }
});

//Get all assets
router.get('/assets/all', async (_req, res) => {
    try {
      const product = await index.getAssets();
      console.log(product);
      console.log('2');
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get assets' });
    }
  });
  

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { address, city, state, zipcode, policyRole } = req.body;
    const updatedProduct = await index.updateProduct(productId, address, city, state, zipcode, policyRole);
    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Burn (spend) a product
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await index.burnProduct(productId);
    res.status(200).json({ message: 'Product burned' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to burn product' });
  }
});

module.exports = router;
