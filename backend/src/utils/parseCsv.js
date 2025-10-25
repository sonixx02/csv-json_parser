const fs = require("fs");
const readline = require("readline");

function setNested(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  });
}

function parseLine(line, delimiter = ",", quote = '"') {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === quote) {
      if (inQuotes && line[i + 1] === quote) {
        current += quote;
        i++; // ignore escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  // Trim whitespace 
  return result.map(field => {
    const trimmed = field.trim();
    if (trimmed.startsWith(quote) && trimmed.endsWith(quote) && trimmed.length >= 2) {
      // "" handle this
      return trimmed.slice(1, -1);
    }
    return trimmed;
  });
}

// used Async 
async function* parseCsv(filePath, options = {}) {
  const delimiter = options.delimiter || process.env.CSV_DELIMITER || ",";
  const quote = options.quote || process.env.CSV_QUOTE || '"';

  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: stream });

  let headers = null;

  for await (let line of rl) {
    if (!line) continue;
    line = line.trim();
    if (!line) continue; //  ignore empty lines

    const values = parseLine(line, delimiter, quote);

    if (!headers) {
      headers = values.map(h => h.trim());
      continue;
    }

    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const val = values[i] !== undefined ? values[i] : "";
      setNested(obj, header, val);
    }

    yield obj;
  }
}

module.exports = parseCsv;
