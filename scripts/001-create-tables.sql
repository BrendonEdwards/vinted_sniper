-- Create tables for Vinted monitoring app
CREATE TABLE IF NOT EXISTS tracked_urls (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tracked_items (
  id SERIAL PRIMARY KEY,
  url_id INTEGER REFERENCES tracked_urls(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  price TEXT,
  item_url TEXT,
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(url_id, item_id)
);

-- Insert sample data
INSERT INTO tracked_urls (url, name) VALUES 
('https://www.vinted.co.uk/catalog?order=newest_first&brand_ids[]=2849141&catalog[]=1725&page=1', 'Brand Jackets'),
('https://www.vinted.co.uk/catalog?order=newest_first&brand_ids[]=2849141&catalog[]=1730&page=1', 'Brand Shirts')
ON CONFLICT (url) DO NOTHING;
