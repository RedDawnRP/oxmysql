import { CFXCallback, CFXParameters, TransactionQuery } from './types';
import { rawQuery } from './database/rawQuery';
import { rawTransaction } from './database/rawTransaction';
import { rawExecute } from './database/rawExecute';
import('./update');

const MySQL = {} as Record<string, Function>;

MySQL.query = (
  query: string,
  parameters: CFXParameters,
  cb: CFXCallback,
  invokingResource = GetInvokingResource(),
  throwError?: boolean
) => {
  rawQuery(null, invokingResource, query, parameters, cb, throwError);
};

MySQL.single = (
  query: string,
  parameters: CFXParameters,
  cb: CFXCallback,
  invokingResource = GetInvokingResource(),
  throwError?: boolean
) => {
  rawQuery('single', invokingResource, query, parameters, cb, throwError);
};

MySQL.scalar = (
  query: string,
  parameters: CFXParameters,
  cb: CFXCallback,
  invokingResource = GetInvokingResource(),
  throwError?: boolean
) => {
  rawQuery('scalar', invokingResource, query, parameters, cb, throwError);
};

MySQL.update = (
  query: string,
  parameters: CFXParameters,
  cb: CFXCallback,
  invokingResource = GetInvokingResource(),
  throwError?: boolean
) => {
  rawQuery('update', invokingResource, query, parameters, cb, throwError);
};

MySQL.insert = (
  query: string,
  parameters: CFXParameters,
  cb: CFXCallback,
  invokingResource = GetInvokingResource(),
  throwError?: boolean
) => {
  rawQuery('insert', invokingResource, query, parameters, cb, throwError);
};

MySQL.transaction = (
  queries: TransactionQuery,
  parameters: CFXParameters,
  cb: (result: boolean) => void,
  invokingResource = GetInvokingResource()
) => {
  rawTransaction(invokingResource, queries, parameters, cb);
};

MySQL.prepare = (
  query: string,
  parameters: CFXParameters,
  cb: CFXCallback,
  invokingResource = GetInvokingResource(),
  throwError?: boolean
) => {
  rawExecute(invokingResource, query, parameters, cb, throwError);
};

MySQL.execute = MySQL.query;
MySQL.fetch = MySQL.query;

for (const key in MySQL) {
  global.exports(key, MySQL[key]);

  const exp = (query: string, parameters: CFXParameters, invokingResource = GetInvokingResource()) => {
    return new Promise((resolve, reject) => {
      MySQL[key](
        query,
        parameters,
        (result: unknown, err: string) => {
          if (err) return reject(new Error(err));
          resolve(result);
        },
        invokingResource,
        true
      );
    });
  };

  global.exports(`${key}_async`, exp);
  global.exports(`${key}Sync`, exp);
}
