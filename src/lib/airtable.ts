import Airtable from "airtable";

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'patSZKQZ5fl8L5Ahd.6f9167e47bb868faecc218d725cfae35c4175d5ca83b93ed28cb335fa6778893'
});

export const npiBase = Airtable.base('appSg02r9nKbATFFO');

export const npiTable = npiBase.table('tbljouHMmZ6Trv4DI')