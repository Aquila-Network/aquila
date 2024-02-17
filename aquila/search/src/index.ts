import { exit } from 'process';
import main from './app';
import { ConfigService } from './lib/ConfigService';

const configService = new ConfigService();

const port = configService.get('PORT');
main().then(app => {
    app.listen(port, () => console.log(`App running on port ${port}`))
}).catch(err => {
    console.log(err);
    exit(1);
})