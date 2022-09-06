import { Get, JsonController } from "routing-controllers";
import { Inject, Service } from "typedi";
import { AquilaClientService } from "../lib/AquilaClientService";

@Service()
@JsonController('/')
export class HomeController {

	@Inject() private aqc: AquilaClientService;

	@Get('/')
	public index() {
		return {
			msg: "Welcome to Aquila X"
		}
	}

}