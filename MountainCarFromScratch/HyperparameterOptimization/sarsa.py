import os
import math
import copy
import time
import random
import itertools
import mountainCar
import numpy as np
import matplotlib.pyplot as plt

## The script started at the time 11:55 PM

## Hyperparameters are alpha, gamma, epsilon


def main():
	
	orders = [ 1,2,3]
	alphas = [ 0.01, 0.05, 0.1 ]
	# gammas = np.arange(0.1,1.1,0.2)
	gammas= [1]
	epsilons = [0.001,0.01,0.1,0.5,0.75]
	
	# orders = [ 1]
	# alphas = [  0.01]
	# # gammas = np.arange(0.1,1.1,0.2)
	# gammas= [1]
	# epsilons = [0.001]

	comparisons = []

	optimal_order = None
	optimal_alpha = None
	optimal_gamma = 1
	optimal_epsilon = None
	min_value = -21000

	for order in orders:
		for alpha in alphas:
			for gamma in gammas:
				for epsilon in epsilons:

					output = []

					for i in range(500):
						print 'Trial Number:  ',i
						output.append(sarsa(alpha, gamma, epsilon,  order, 2))

					output_array = np.array(output)
					np.save('SARSA_final_output',output_array)
					averages = np.mean(output_array, axis = 0)

					averages_100 = averages[100:]
					mean_averages_100 = np.mean(averages_100)

					if(mean_averages_100>min_value):
						min_value = mean_averages_100
						optimal_order = order
						optimal_epsilon = epsilon
						optimal_alpha = alpha
						
					print 'Order:',order, '  alpha: ',alpha,' gamma: ',gamma,' epsilon: ',epsilon,' mean: ',mean_averages_100 
					comparisons.append([order, alpha, gamma, epsilon, mean_averages_100])
					
	comparisons_np_array = np.array(comparisons)
	np.save("comparison_np_array",comparisons_np_array)
	
	print 'Optimal order is: ',optimal_order
	print 'Optimal_alpha: ',optimal_alpha
	print 'Optimal_gamma:',optimal_gamma
	print 'Optimal_epsilon: ',optimal_epsilon
	print 'Optimal loss value is: ',min_value

	outputs = []
	for i in range(500):
		output = sarsa( optimal_alpha, optimal_gamma, optimal_epsilon, optimal_order, 2)
		outputs.append(output)

	outputs = np.array(outputs)
	
	plt.figure(1)
	plt.plot(np.mean(outputs,axis=0))
	plt.title("For the optimal hyper parameters")
	plt.gca().set_ylim([-1000,0])
	plt.show()

	plt.figure(2)
	plt.errorbar(range(200), np.mean(outputs,axis=0), np.std(outputs,axis=0))
	plt.title(" Error bar for the optimal hyper parameters")
	plt.gca().set_ylim([-1000,0])
	plt.show()

def fourier_basis(order,dimension):
	output = np.array(list(itertools.product(range(order+1), repeat=dimension)))
	return output

def getFeatureVector(state , velocity ,no_features, action,n,d):
	
	leftPosBound = -1.2
	rightPosBound = 0.5
	leftVelBound = -0.07
	rightVelBound = 0.07

	feature_vector = []
	# state_vector = [state, velocity]
	state2 = float(state - leftPosBound)/(rightPosBound -leftPosBound)
	velocity2 = float(velocity - leftVelBound)/(rightVelBound-leftVelBound)

	c = fourier_basis(n,d)
	state_velocity2 = np.array([state2,velocity2])

	feature_vector = np.zeros((no_features))

	t = int(no_features/3.0)
	
	prod = np.sum( c*state_velocity2, axis =1)
	feature_vector[(action+1)*t:(action+1)*t+t]=np.cos(np.pi*prod)

	return feature_vector

def epsilon_greedy( action, epsilon):
	
	random_number = np.random.random()
	agent_actions = [-1,0,1]

	if(random_number > epsilon):
		return action
	else:
		return random.choice(agent_actions)

def sarsa(learning_rate, discount_factor, epsilon, degree, dimension):

	## Important parameters
	num_episodes = 200
	num_iters = 20000

	## I think even this should change. 
	no_features = ((degree+1)**dimension)*3
	no_actions = 3

	actions = [ -1, 0, 1 ]

	# learning_rate = 0.05
	# discount_factor = 1
	# epsilon = 0.5

	weights = np.zeros((no_features))

	n = 0
	returns = []

	while(n < num_episodes):

		n+=1
		mc = mountainCar.mountainCar()
		p_state, p_velocity = mc.getInitialState()

		iteration = 0
		episode_return = 0
		episode_reward = 0

		arr1 = []

		for i in actions:
			p_state_feature = getFeatureVector ( p_state, p_velocity, no_features, i, degree, dimension)
			product = np.sum(weights*np.array(p_state_feature))
			arr1.append(product)

		value = arr1.index(max(arr1))
		a_ = epsilon_greedy(value-1, epsilon)
		pres_q_value = arr1[a_+1]

		terminated = False

		while( not terminated and iteration < num_iters):

			iteration += 1
			n_state, n_velocity ,n_reward, goal = mc.throttle(a_)

			if(goal):
				terminated = True

			episode_return += pres_q_value
			episode_reward += n_reward


			if(not goal):
				arr2 = []
				for j in actions:
					n_state_feature = getFeatureVector( n_state, n_velocity, no_features,j, degree, dimension)
					q_value = np.sum(np.array(weights)*np.array(n_state_feature))
					arr2.append(q_value)

				a_prime = epsilon_greedy( arr2.index(max(arr2))-1 , epsilon)
				next_q_value = arr2[a_prime+1]

			else:
				a_prime = 0
				next_q_value = 0

			td_error = n_reward + discount_factor*next_q_value - pres_q_value
			update = learning_rate*(td_error)*getFeatureVector(p_state, p_velocity, no_features, a_, degree, dimension)
			weights = weights + update
			p_state = n_state
			p_velocity = n_velocity
			a_ = a_prime
			pres_q_value = next_q_value

		returns.append(episode_reward)
		# print 'Epsidoe Reward: ',episode_reward
	return returns

if(__name__=='__main__'):
	main()
