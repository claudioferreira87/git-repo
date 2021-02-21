import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';
import { Header, RespositoryInfo, Issues } from './styles';
import api from '../../services/api';

interface IRepositoryParams {
	repository: string;
}

interface IRepository {
	full_name: string;
	description: string;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	owner: {
		login: string;
		avatar_url: string;
	};
}

interface IIssue {
	id: number;
	title: string;
	html_url: string;
	user: {
		login: string;
	};
}

const Repository: React.FC = () => {
	const { params } = useRouteMatch<IRepositoryParams>();
	const [repository, setRepository] = useState<IRepository | null>(null);
	const [issues, setIssues] = useState<IIssue[]>([]);

	useEffect(() => {
		async function loadData() {
			const [repository, issues] = await Promise.all([
				api.get(`repos/${params.repository}`).then(resp => resp.data),
				api.get(`repos/${params.repository}/issues`).then(resp => resp.data),
			]);

			setRepository(repository);
			setIssues(issues);
		}

		loadData();
	}, [params.repository]);

	return (
		<>
			<Header>
				<img src={logoImg} alt="Github explorer" />
				<Link to="/">
					<FiChevronLeft size={16} />
					Back
				</Link>
			</Header>
			{repository && (
				<RespositoryInfo>
					<header>
						<img src={repository.owner.avatar_url} alt={repository.owner.login} />
						<div>
							<strong>{repository.full_name}</strong>
							<p>{repository.description}</p>
						</div>
					</header>
					<ul>
						<li>
							<strong>{repository.stargazers_count}</strong>
							<span>Stars</span>
						</li>
						<li>
							<strong>{repository.forks_count}</strong>
							<span>Forks</span>
						</li>
						<li>
							<strong>{repository.open_issues_count}</strong>
							<span>Open Issues</span>
						</li>
					</ul>
				</RespositoryInfo>
			)}
			<Issues>
				{issues.map(issue => (
					<a key={issue.id} href={issue.html_url}>
						<div>
							<strong>{issue.title}</strong>
							<p>{issue.user.login}</p>
						</div>
						<FiChevronRight size={20} />
					</a>
				))}
			</Issues>
		</>
	);
};

export default Repository;
