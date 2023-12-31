import axios from "axios";
import chalk from "chalk";

class CryptoApi {
	constructor(apiKey) {
		this.apiKey = apiKey;
		this.instance = axios.create({
			baseURL: "https://pro-api.coinmarketcap.com",
			headers: {
				"X-CMC_PRO_API_KEY": this.apiKey,
			},
		});
	}

	// Latest 10 coins
	async getPriceLatest(curOption) {
		const url = `/v1/cryptocurrency/listings/latest?convert=${curOption}&limit=10`;

		const { data } = await this.instance.get(url);

		let output = "";

		// Format output
		data.data.forEach((coin) => {
			const { symbol, name } = coin;
			const { price, percent_change_24h } = coin.quote[curOption];
			const change24H = percent_change_24h > 0 ? chalk.green(percent_change_24h.toFixed(2)) : chalk.red(percent_change_24h.toFixed(2));

			output += `${chalk.whiteBright.bold(name)} (${chalk.yellow(symbol)}) | Price: ${chalk.cyan(
				price.toFixed(3)
			)} | % 24H: ${change24H}\n`;
		});

		return output;
	}

	// Specifics coin
	async getPriceCoin(coinOption, curOption) {
		const url = `/v2/cryptocurrency/quotes/latest?convert=${curOption}&symbol=${coinOption}`;
		const reponse = await this.instance.get(url);

		let output = "";
		const coins = coinOption.split(",");

		// Format output
		for (let c of coins) {
			const data = reponse.data.data[c];

			// Validate coin name
			if (!data.length) {
				console.log(chalk.redBright(`Coin: ${chalk.yellow(c)} not found`));
				continue;
			}

			const { name, symbol, quote } = data[0];
			const { price, percent_change_24h } = quote[curOption];

			const change24H = percent_change_24h > 0 ? chalk.green(percent_change_24h.toFixed(2)) : chalk.red(percent_change_24h.toFixed(2));

			output += `${chalk.whiteBright.bold(name)} (${chalk.yellow(symbol)}) | Price: ${chalk.cyan(
				price.toFixed(3)
			)} | % 24H: ${change24H}\n`;
		}

		return output;
	}
}

export default CryptoApi;
