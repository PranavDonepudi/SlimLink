//run node test.js in slimlink-backend and you'll see all of the links in bigtable
const { Bigtable } = require('@google-cloud/bigtable');

const projectId = 'rice-comp-539-spring-2022';
const instanceId = 'comp-539-bigtable';
const tableId = 'slimlink-URLs';

async function fetchAllRowsMetadata() {
  const bigtable = new Bigtable({ projectId });
  const instance = bigtable.instance(instanceId);
  const table = instance.table(tableId);

  try {
    // Fetch all rows from the table
    const [rows] = await table.getRows();

    if (rows.length === 0) {
      console.log('No rows found in the table.');
    } else {
      console.log(`Found ${rows.length} rows. Printing metadata:`);
      rows.forEach((row) => {
        const rowKey = row.id;
        const metadata = row.data.metadata;

        console.log(`Row Key: ${rowKey}`);
        console.log({
          clicks: metadata?.clicks?.[0]?.value || 'N/A',
          createdAt: metadata?.createdAt?.[0]?.value || 'N/A',
          longURL: metadata?.longURL?.[0]?.value || 'N/A',
          shortURL: metadata?.shortURL?.[0]?.value || 'N/A',
        });
        console.log('-------------------');
      });
    }
  } catch (err) {
    console.error('Error fetching rows metadata:', err.message);
  }
}

fetchAllRowsMetadata().catch(console.error);
