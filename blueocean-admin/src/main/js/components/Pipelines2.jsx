import React, { Component, PropTypes } from 'react';
import { PipelineRecord } from './records';
import Table from './Table';
import { ResultHelper } from '../Result';
import { InterstitialContainer, Label } from './InterstitialContainer';

import { Page, PageHeader, Title, Favorite, WeatherIcon } from '@jenkins-cd/design-language';
import { ExtensionPoint } from '@jenkins-cd/js-extensions';

const { array, bool } = PropTypes;

export default class Pipelines2 extends Component {

    render() {
        const { pipelines } = this.context;

        if (ResultHelper.isError(pipelines)) {
            if (pipelines.statusCode === 404) {
                return <div>Not Found!</div>
            }
            return <div>Error...</div>;
        }

        const pipelineRecords = !ResultHelper.isPending(pipelines) ?
            pipelines.map(data => new PipelineRecord(data))
            .sort(pipeline => !!pipeline.branchNames) :
            [];

        return (
            <Page>
                <PageHeader>
                    <Title>
                        <h1>Dashboard</h1>
                        <a
                          target="_blank"
                          className="btn-inverse"
                          href="/jenkins/view/All/newJob"
                        >
                            New Pipeline
                        </a>
                    </Title>
                </PageHeader>
                <main>
                    <article>
                        <InterstitialContainer pending={ResultHelper.isPending(pipelines)}>
                            <Label>hello</Label>
                        </InterstitialContainer>

                        <ExtensionPoint name="jenkins.pipeline.list.top" />
                        <Table
                          className="multiBranch"
                          headers={['Name', 'Health', 'Branches', 'Pull Requests', '']}
                        >
                            { pipelineRecords
                                .map(pipeline => (
                                    <tr key={pipeline.name}>
                                        <td>{pipeline.name}</td>
                                        <td><WeatherIcon score={pipeline.weatherScore} /></td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td><Favorite /></td>
                                    </tr>
                                ))
                            }
                        </Table>
                    </article>
                </main>
            </Page>);
    }
}



Pipelines2.contextTypes = {
    pipelines: array,
};
