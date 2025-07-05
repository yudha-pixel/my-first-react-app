import { Client, Databases, Account, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID,
           [ Query.equal('searchTerm', searchTerm)]
        );

        if (response.documents.length > 0) {
            const doc = response.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),{
                searchTerm,
                count: 1,
                movie_id: movie.ids.trakt,
                poster_url: `https://${movie.images.poster}`,
            })
        }

    } catch (error) {
        console.log(`Error updating search count: ${error}`);
    }
};

export const getTrendingMovies = async () => {
    try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(10),
            Query.orderDesc('count'),
        ]);
        return response.documents;
    } catch (error) {
        console.log(`Error fetching trending movies: ${error}`);
        return [];
    }
};
