import React, { Component, PropTypes } from 'react';
import { PipelineRecord } from './records';
import { ResultHelper } from '../Result';
import { InterstitialContainer, Label, Table, makeData } from './InterstitialContainer';
import {
    EmptyStateView, Favorite, Page, PageHeader, Title, WeatherIcon,
}
    from '@jenkins-cd/design-language';
import { ExtensionPoint } from '@jenkins-cd/js-extensions';

const { array } = PropTypes;

export default class Pipelines2 extends Component {

    render() {
        const { pipelines } = this.context;

        const error = ResultHelper.isError(pipelines);
        const pending = ResultHelper.isPending(pipelines);

        const pipelineRecords = ResultHelper.isValue(pipelines)
            ? pipelines.map(data => new PipelineRecord(data))
                .sort(pipeline => !!pipeline.branchNames)
            : makeData('name');

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
                        <ExtensionPoint name="jenkins.pipeline.list.top" />
                    { error &&
                        <EmptyStateView tightLayout>No pipelines were found.</EmptyStateView>
                    }
                    { !error &&
                        <InterstitialContainer pending={pending}>
                            <Table
                              className="multiBranch"
                              headers={['Name', 'Health', 'Branches', 'Pull Requests', '']}
                            >
                            { pipelineRecords.map(pipeline => (
                                <tr key={pipeline.name}>
                                    <td><Label>{pipeline.name}</Label></td>
                                    <td><WeatherIcon score={pipeline.weatherScore} /></td>
                                    <td><Label>-</Label></td>
                                    <td><Label>-</Label></td>
                                    <td><Favorite /></td>
                                </tr>
                            )) }
                            </Table>
                        </InterstitialContainer>
                    }
                    </article>
                </main>
            </Page>);
    }
}

Pipelines2.contextTypes = {
    pipelines: array,
};
