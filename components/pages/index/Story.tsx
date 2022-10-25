import classes from './Story.module.scss';

const Story = () => {
    return (
        <div className={classes.story}>
            <h4 className={classes["story__title"]}>Interested to read the <a className={classes["story__link"]} href="">story of Aquila Network</a>?</h4>
        </div>
    )
}

export default Story;