
const driver = require('bigchaindb-driver');
const conn = new driver.Connection('http://localhost:9984/api/v1/');

// Create a product
async function createProduct(firstName, lastName, age, birthSex) {
  try {
    const assets = {
      firstName: firstName,
      lastName: lastName,
      age: age,
      birthSex: birthSex
    };
    const metadata = {
      type: 'product'
    };

    //Creating new keypair for Public/Private keys
    const keypair = new driver.Ed25519Keypair();
    const publicKey = keypair.publicKey;

    //Creating a Transaction
    const transaction = driver.Transaction.makeCreateTransaction(
      assets,
      metadata,
      [driver.Transaction.makeOutput(
        driver.Transaction.makeEd25519Condition(publicKey)
      )],
      publicKey
    );

    //Signing a Transaction
    const signedTransaction = driver.Transaction.signTransaction(
      transaction,
      keypair.privateKey
    );

    //Posting a Transaction and receiving the Transaction ID
    try{
      const response = await conn.postTransactionCommit(signedTransaction);
      return response.id;
    } catch (error) {
      console.error(error);
    }

    console.log('1-5');
  } catch (error) {
    throw new Error('Failed to create product');
  }
}

// Get a product by ID
async function getProductById(id) {
  try {
    const asset = await conn.searchAssets(id);
    return asset[0].data;
  } catch (error) {
    throw new Error('Failed to get product');
  }
}

// Get all Assets
async function getAssets() {
  try {
    console.log('0');
    const asset = await conn.assets.find();
    console.log('1');
    console.log(asset);
    return asset;
  } catch (error) {
    throw new Error('Failed to get asset');
  }
}

// Append a new transaction to a product
async function updateProduct(id, firstName, lastName, age, birthSex) {
  try {
    const asset = await conn.searchAssets(id);
    const product = asset[0];

    const updatedProduct = {
      ...product.data,
      firstName: firstName,
      lastName: lastName,
      age: age,
      birthSex: birthSex
    };

    const transaction = driver.Transaction.makeAppendTransaction(
      [product],
      updatedProduct,
      [driver.Transaction.makeOutput(
        driver.Transaction.makeEd25519Condition('public_key_here')
      )]
    );

    const signedTransaction = driver.Transaction.signTransaction(
      transaction,
      'private_key_here'
    );

    await conn.postTransactionCommit(signedTransaction);
    return updatedProduct;
  } catch (error) {
    throw new Error('Failed to update product');
  }
}

// Example function to burn (spend) a product
async function burnProduct(id) {
  try {
    const transaction = driver.Transaction.makeBurnTransaction(id);

    const signedTransaction = driver.Transaction.signTransaction(
      transaction,
      'private_key_here'
    );

    await conn.postTransactionCommit(signedTransaction);
    return 'Product burned';
  } catch (error) {
    throw new Error('Failed to burn product');
  }
}

module.exports = {
  createProduct,
  getProductById,
  getAssets,
  updateProduct,
  burnProduct
};


// const driver = require('bigchaindb-driver');

// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
//   process.exit(1);
//   });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Promise Rejection:', reason);
//   process.exit(1);
//   });

// const Api = 'https://http://localhost:9984/api/v1/';
// const connection = new driver.Connection(Api);

// console.log('Connected to Database');

// async function performOperations(){

//   const alice = new driver.Ed25519Keypair()
//   const bob = new driver.Ed25519Keypair()
  
//   const assetdata = {
//       'bicycle': {
//               'serial_number': 'abcd1234',
//               'manufacturer': 'Bicycle Inc.',
//       }
//   }
  
//   const metadata = {'planet': 'earth'}
  
//   const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
//       assetdata,
//       metadata,
  
//       // A transaction needs an output
//       [ driver.Transaction.makeOutput(
//               driver.Transaction.makeEd25519Condition(alice.publicKey))
//       ],
//       alice.publicKey
//   )
  
//   console.log('1');

//   txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)
//   connection.postTransactionCommit(txCreateAliceSimpleSigned)
//   txid = txCreateAliceSimpleSigned.id;
//   console.log("txid:", txid);
  
//   console.log('2');

//   connection.getTransaction(txCreateAliceSimpleSigned.id);
  
//   console.log('3');

//   const txTransferBob = driver.Transaction.makeTransferTransaction(
//       // signedTx to transfer and output index
//       [{ tx: txCreateAliceSimpleSigned, output_index: 0 }],
  
//       [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(bob.publicKey))],
  
//       // metadata
//       {price: '100 euro'}
//   );
//   console.log('4');
  
//   txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, alice.privateKey);
//   connection.postTransactionCommit(txTransferBobSigned)
//   async function processFile(){
//     try {
//       console.log('Is Bob the owner?', txTransferBobSigned['outputs'][0]['public_keys'][0] == bob.publicKey);
//     }
//     catch (error) {
//       console.error("Error: ", error);
//     }
    
//   }
//   console.log('5');
//   //Output: true
//   processFile();
//   console.log('6');

//   assets = [
//     {'data': {'bicycle': {'serial_number': 'abc', manufacturer: 'Bicycle Inc.'}}},
//     {'data': {'bicycle': {'serial_number': 'cde', manufacturer: 'Bicycle Inc.'}}},
//     {'data': {'bicycle': {'serial_number': 'fgh', manufacturer: 'Bicycle Inc.'}}}
//  ]
//  console.log('7');

//  connection.searchAssets('Bicycle Inc.')
//         .then(assets => console.log('Found assets with serial number Bicycle Inc.:', assets))
// }

// console.log('8');

// performOperations();

// console.log('9');



// // console.log('Is Bob the owner?', txTransferBobSigned['outputs'][0]['public_keys'][0] == bob.publicKey)

// // async function main() {
// //   try {
// //     await processFile();
// //     return
// //   } 
// //   catch (err) {
// //     console.error("catching error");
// //   }
// // }

// // main();