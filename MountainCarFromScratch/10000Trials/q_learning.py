import os
import math
import copy
import random
import mountainCar
import numpy as np
import matplotlib.pyplot as plt


def main():

	output = []
	for i in range(10000):
		print 'Trial Number:  ',i
		output.append(q_learning())

	np.save("outputFile",output)
	output_numpy = np.array(output)
	averages = np.mean(output_numpy, axis = 0)
	
	plt.plot(averages)
	plt.title("Mean Undiscounted Return vs no Of Episodes")
	plt.gca().set_ylim([-1000,0])
	plt.show()

	plt.errorbar( range(60), np.mean(output_numpy, axis = 0), yerr = np.std(output_numpy, axis = 0))
	plt.title("Error bars")
	plt.gca().set_ylim([-1000,0])
	plt.show()

def getFeatureVector(state , velocity ,no_features, action):

	leftPosBound = -1.2
	rightPosBound = 0.5
	leftVelBound = -0.07
	rightVelBound = 0.07

	feature_vector = []

	state2 = float(state - leftPosBound)/(rightPosBound -leftPosBound)
	velocity2 = float(velocity - leftVelBound)/(rightVelBound-leftVelBound)

	c = np.array([[0 ,0],[0 ,1],[1 ,0],[1 ,1]])
	state_velocity2 = np.array([state2,velocity2])

	feature_vector = np.zeros((12))

	prod = np.sum(c*state_velocity2, axis =1)
	feature_vector[(action+1)*4:(action+1)*4+4]=np.cos(np.pi*prod)
	return feature_vector


def epsilon_greedy( action, epsilon):

	random_number = np.random.random()
	agent_actions = [-1,0,1]

	if(random_number > epsilon):
		return action
	else:
		return random.choice(agent_actions)


def q_learning():

	## Important parameters
	## Hyper parameters
	num_episodes = 60
	num_iters = 20000

	## I think even this should change. 
	no_features = 12
	no_actions = 3
	epsilon = 0.5
	actions = [ -1, 0, 1 ]

	learning_rate = 0.05
	discount_factor = 1

	weights = np.zeros((12))

	n = 0
	returns = []

	while(n < num_episodes):
		
		n+=1
		mc = mountainCar.mountainCar()
		p_state, p_velocity = mc.getInitialState()

		iteration = 0
		episode_return = 0
		episode_reward = 0

		# arr1 = []
		# for i in actions:
		# 	p_state_feature = getFeatureVector ( p_state, p_velocity, no_features, i)
		# 	product = np.sum(weights*np.array(p_state_feature))
		# 	arr1.append(product)

		# value = arr1.index(max(arr1))
		# a_ = epsilon_greedy(value-1, epsilon)
		# pres_q_value = arr1[a_+1]

		while(iteration < num_iters):
			iteration += 1
			arr1 = []

			for i in actions:
				p_state_feature = getFeatureVector ( p_state, p_velocity, no_features, i)
				product = np.sum(weights*np.array(p_state_feature))
				arr1.append(product)

			value = arr1.index(max(arr1))
			a_ = epsilon_greedy(value-1, epsilon)
			pres_q_value = arr1[a_+1]

			n_state, n_velocity ,n_reward, goal = mc.throttle(a_)

			episode_return += pres_q_value
			episode_reward += n_reward

			if(not goal):
				arr2 = []
				for j in actions:
					n_state_feature = getFeatureVector( n_state, n_velocity, no_features,j)
					q_value = np.sum(np.array(weights)*np.array(n_state_feature))
					arr2.append(q_value)

				## Need to apply epsilon greedy here also. 
				a_prime = arr2.index(max(arr2))-1
				next_q_value = arr2[a_prime+1]

			else:
				a_prime = 0
				next_q_value = 0
				break

			td_error = n_reward + discount_factor*next_q_value - pres_q_value
			update = learning_rate*(td_error)*getFeatureVector(p_state,p_velocity, no_features,a_)
			weights = weights + update
			p_state = n_state
			p_velocity = n_velocity
				
		returns.append(episode_reward)
	return returns

if(__name__=='__main__'):
	main()
