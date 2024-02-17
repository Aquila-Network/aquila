import Img from 'next/image';
import Link from 'next/link';

import Logo from '../../../public/img/logo.png';
import BaseLayout from '../base/baseLayout';
import classes from './BoxCenterLayout.module.scss';

const BoxCenterLayout = (props: any) => {
	return(
		<BaseLayout>
			<div className={classes["box-center-layout"]}>
				<div className={classes["box-center-layout__box"]}>
					<div className={classes["box-center-layout__box-header"]}>
						<div className={classes["box-center-layout__box-header-logo"]}>
							<Link href="/">
								<a>
									<Img src={Logo} />
								</a>
							</Link>
						</div>
					</div>
					<div className={classes["box-center-layout__box-body"]}>
						{props.children}
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}

export default BoxCenterLayout;