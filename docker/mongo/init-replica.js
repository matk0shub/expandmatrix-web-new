db = db.getSiblingDB('admin');

const config = {
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }],
};

const initiateReplicaSet = () => {
  try {
    const status = rs.status();
    if (status.ok) {
      print('[mongo-init] Replica set already configured.');
      return;
    }
  } catch (error) {
    if (error.codeName === 'NotYetInitialized') {
      print('[mongo-init] Replica set not yet initialized, running rs.initiate().');
      rs.initiate(config);
      try {
        printjson(rs.status());
      } catch (statusError) {
        print('[mongo-init] Replica set initiated, waiting for PRIMARY state.');
      }
      return;
    }

    print('[mongo-init] Unexpected error while checking replica set status:');
    printjson(error);
    throw error;
  }

  print('[mongo-init] Replica set status indeterminate, forcing configuration.');
  rs.initiate(config);
  try {
    printjson(rs.status());
  } catch (statusError) {
    print('[mongo-init] Replica set initiated, waiting for PRIMARY state.');
  }
};

initiateReplicaSet();
