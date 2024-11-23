const { Bigtable } = require('@google-cloud/bigtable');

const projectId = 'rice-comp-539-spring-2022';
const instanceId = 'comp-539-bigtable';
const tableId = 'slimlink-URLs';

async function fetchRowMetadata(rowKey) {
  const bigtable = new Bigtable({ projectId });
  const instance = bigtable.instance(instanceId);
  const table = instance.table(tableId);

  try {
    const [row] = await table.row(rowKey).get();
    if (!row) {
      console.log(`Row with key "${rowKey}" not found.`);
    } else {
      console.log(`Row "${rowKey}" metadata:`);
      
      const metadata = row.data.metadata;
      console.log({
        clicks: metadata.clicks[0].value,
        createdAt: metadata.createdAt[0].value,
        longURL: metadata.longURL[0].value,
        shortURL: metadata.shortURL[0].value,
      });
    }
  } catch (err) {
    console.error('Error reading row metadata:', err.message);
  }
}

// add the short url code of any to test whether metadata is loaded
fetchRowMetadata('nsahn9').catch(console.error);
