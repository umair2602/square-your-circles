import type { NextApiRequest, NextApiResponse } from 'next';
import Carbon from '../../../../models/carbon';
import connectDB from '@/../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_trend_gl.txt';
    const response = await fetch(url);
    const text = await response.text();

    const lines = text.split('\n');

    const dataLines = lines
      .filter(line => /^\s*\d{4}/.test(line))
      .map(line => line.trim().split(/\s+/));

    let date: string | null = null;
    let ppm: number | null = null;

    if (dataLines.length > 0) {
      const lastLine = dataLines[dataLines.length - 1];
      const [year, month, day, smoothed] = lastLine;

      if (year && month && day && smoothed) {
        date = new Date(Date.UTC(+year, +month - 1, +day)).toISOString();
        ppm = parseFloat(smoothed);
      }
    }

    await connectDB();

    if (date && ppm) {
      // Update or create the carbon data document
      const updatedData = await Carbon.findOneAndUpdate(
        {},
        { date, ppm },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      return res.status(200).json({ date, ppm });
    } else {
      // Attempt to retrieve existing document from DB
      const existingData = await Carbon.findOne({});
      if (existingData) {
        return res.status(200).json({
          date: existingData.date,
          ppm: existingData.ppm,
          note: 'Returned existing data due to parsing failure',
        });
      } else {
        return res.status(500).json({ error: 'Failed to extract CO2 data and no existing data found' });
      }
    }
  } catch (error) {
    console.error('Error fetching NOAA data:', error);
    return res.status(500).json({ error: 'Failed to fetch CO2 data' });
  }
}
