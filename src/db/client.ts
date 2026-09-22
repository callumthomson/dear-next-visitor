import { drizzle } from 'drizzle-orm/libsql/web';
import { Resource } from 'sst';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export const db = () => {
	if (!dbInstance) {
		dbInstance = drizzle({
			connection: {
				url: Resource.LIBSQL_DB_URL.value,
				authToken: Resource.LIBSQL_DB_TOKEN.value,
			},
			schema,
		});
	}

	return dbInstance;
};
