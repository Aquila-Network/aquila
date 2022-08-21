import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController('/')
export class HomeController {

	@Get('/')
	public index() {
		return {
			msg: "Welcome to Aquila X"
		}
	}

}