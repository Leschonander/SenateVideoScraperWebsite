import { connectToElasticsearch } from '../../lib/elasticsearch';

export default async function search(req, res) {
  const client = await connectToElasticsearch();
  const query = req.body;

  const result = await client.search({
    index: 'first-view',
    body: {
      size: 50,
      query: {
        match: {
          text: req.body,
        },
      },
    },
  });

  let data = result['hits']['hits'];
  res.status(200).json({ data: data });
}
