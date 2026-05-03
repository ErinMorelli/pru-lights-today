# prudentialcenterlights.today

A single-page site that displays tonight's [Prudential Center](https://www.prudentialcenter.com/) tower lighting event in Boston, MA.

**Live site:** [prudentialcenterlights.today](https://prudentialcenterlights.today)

## How it works

A GitHub Actions workflow runs every 6 hours and uses the [`pru-lights`](https://github.com/ErinMorelli/pru-lights) Python library to fetch the current lighting schedule from the Prudential Center website. The result is saved to `data.json` and the static site is deployed to GitHub Pages.

The page loads `data.json` at runtime and displays the current event — or a "no event tonight" message if nothing is scheduled.

## Development

Install dependencies and generate data locally:

```bash
pip install -r requirements.txt
pip install /path/to/pru-lights
python scripts/generate_data.py data.json
```

Then open `index.html` in a browser (via a local server to allow the `fetch()` call):

```bash
python -m http.server 8000
```
