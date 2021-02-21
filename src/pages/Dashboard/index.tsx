import React, { FormEvent, useState, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import API from '../../services/api';

import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
	const [newRepo, setNewRepo] = useState('');
	const [inputError, setInputError] = useState('');
	const [repositories, setRepositories] = useState<IRepository[]>(() => {
		const storagedRepositories = localStorage.getItem('@githubExplorer:repositories');

		if (storagedRepositories) {
			return JSON.parse(storagedRepositories);
		}

		return [];
	});

	useEffect(() => {
		localStorage.setItem('@githubExplorer:repositories', JSON.stringify(repositories));
	}, [repositories]);

	interface IRepository {
		full_name: string;
		description: string;
		owner: {
			login: string;
			avatar_url: string;
		};
	}

	async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
		event?.preventDefault();

		if (!newRepo) {
			setInputError('Repository is required! Ex: [author]/[name]');
			return;
		}

		try {
			const response = await API.get<IRepository>(`repos/${newRepo}`);

			const repository = response.data;
			setRepositories([...repositories, repository]);
			setInputError('');
			setNewRepo('');
		} catch (error) {
			setInputError(`${error}`);
		}
	}

	return (
		<>
			<img src={logoImg} alt="Github Explorer" />
			<Title>Explore repositories on Github!</Title>

			<Form hasError={Boolean(!!inputError)} onSubmit={handleAddRepository}>
				<input
					value={newRepo}
					onChange={e => setNewRepo(e.target.value)}
					placeholder="Type the repositor's name!"
					type="text"
				/>
				<button type="submit">Search</button>
			</Form>

			{inputError && <Error>{inputError}</Error>}

			<Repositories>
				{repositories.map(repository => (
					<Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
						<img src={repository.owner.avatar_url} alt={repository.owner.login} />
						<div>
							<strong>{repository.full_name}</strong>
							<p>{repository.description}</p>
						</div>
						<FiChevronRight size={20} />
					</Link>
				))}
			</Repositories>
		</>
	);
};

export default Dashboard;
