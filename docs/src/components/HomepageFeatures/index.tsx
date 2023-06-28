import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    // Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Multi-scale',
        // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>Chromoscope enables a user to analyze structural variants at multiple scales, using four main views.</>
        )
    },
    {
        title: 'Multi-form',
        // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                Each view uses different visual representations that can facilitate the interpretation for a given level
                of scale.
            </>
        )
    },
    {
        title: 'Interactivity',
        // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: <>All views in Chromoscope are interactive, allowing a user to explore data effectively.</>
    },
    {
        title: 'Easy to Setup',
        // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: <>Chromoscope users can load their data without setting up a dedicated server.</>
    }
];

function Feature({ title, description }: FeatureItem) {
    return (
        <div className={clsx('col col--3')}>
            {/* <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div> */}
            <div className="text--left padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
