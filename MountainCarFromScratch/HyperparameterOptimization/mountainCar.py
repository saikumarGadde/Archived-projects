import math
import random

"""
@TODO: 
Done -> 1. Need to stop the episode after certain number of steps. 
2. 
"""

class mountainCar(object):
	## Initialize the mountain car object.

	def __init__(self):
		## Initialize the starting positions and also the starting velocities.

		self.leftPosBound = -1.2
		self.rightPosBound = 0.5
		self.leftVelBound = -0.07
		self.rightVelBound = 0.07
		
		# self.presentPosition = round( random.uniform(-0.6,-0.4), 1)
		self.presentPosition = -0.5
		self.presentVelocity = 0
		self.episodeReward = 0
		self.epsiodeCount = 0
		self.presentReward = 0

		self.endEpisode = 0
		self.goalReached = 0

	def getInitialState(self):
		# normalized_state = (self.presentPosition - self.leftPosBound)/(self.rightPosBound-self.leftPosBound)
		# normalized_vel = (self.presentVelocity - self.leftVelBound)/(self.rightVelBound - self.leftVelBound)
		return self.presentPosition, self.presentVelocity


	def throttle(self, thro):

		if(not self.goalReached):
			# print ('came inside')
			v_t_plus_one = (self.presentVelocity + 0.001*thro - 0.0025*math.cos(3*self.presentPosition))
			x_t_plus_one = (self.presentPosition + v_t_plus_one)

			self.presentVelocity = v_t_plus_one
			self.presentPosition = x_t_plus_one
			
			if(self.presentPosition< self.leftPosBound):
				self.presentPosition = self.leftPosBound
				self.presentVelocity = 0

			elif(self.presentPosition >= self.rightPosBound):
				self.presentPosition = self.rightPosBound
				self.goalReached = 1

			if(not self.goalReached):
				# self.episodeReward += -1
				self.presentReward = -1
			else:
				self.presentReward = 1
			
			return self.presentPosition,self.presentVelocity, self.presentReward , self.goalReached

		else:
			return self.rightPosBound, 0, 0, self.goalReached

	def getPosition(self):
		return (self.presentPosition-self.leftPosBound)/(self.rightPosBound-self.leftPosBound)


	def getVelocity(self):
		return self.presentVelocity

	def getReward(self):
		return self.episodeReward

	def getEpisodicReward(self):
		return self.episodeReward
	