Contribution Guide
=================

## Co-Authors
Ross Reicks
Lexi Reicks

Prerequisites
---------
### Git : 
To install git on **mac** the easiest way is to open terminal and copy this: 
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
It will ask you if you want to install xcode command line tools (ruby and others) and you say yes. Then once that is all finished enter: 
```
brew install git
```
and it will install git on your machine and you should be ready to go.

---------

Now for **Windows Users**: Git has a build package on windows that you can install here: 
```
https://git-scm.com/download/win
```
Once that is installed, run the installer. And you should be all set up. Easy.

### Virtual Box: 
To install virtual box go here and run the correct installer: 
```
https://www.virtualbox.org/wiki/Downloads?replytocom=98578
```
### Vagrant: 
To install Vagrant, go here and run the correct install: 
```
https://www.vagrantup.com/downloads.html
```

Gettings Started:
--------
Once all the prerequisites have been installed, its time to set up a copy on your local machine. 

1. Open a terminal window. If on PC this is PowerShell on mac this is Terminal.

2. cd into a directory where you would like your project to go. Ie: cd Documents

3. Type ```git clone https://github.com/lmreicks/upick.git``` and type in your iastate credentials. This will pull all the files down from the repository and add them to a new folder on your machine called upick. 

4. Cd into your newly created UPick folder and type ```vagrant up```

5. This will initiate the server and the project is running. Open your web browser and go to 192.168.33.11 and you will see a welcome message.
 
6. Before you make any changes to the code, we need to set you up with your own branch. To do this, in terminal type ```git branch *BranchName*```  this will create a new branch called branchName. Now you need to switch to that branch so type ```git checkout *BranchName*``` and you will switch to a branch of your own!

7. Now we will do your first commit to show you how to save your changes to the repository. Create a new file in UPick directory called YourName.txt  and add some text in it. Then in your terminal window, type ```git add -all``` this will “Stage” all your changes. Next type ```git commit -m “Type a message here about what your commit is about”``` this will add a new commit to your local code repository. A commit is a saved change. You can read more about Git on their website.

8. Finally, to sync up your local repository with the Iowa State remote repository. Type ```git push -u origin *BranchName*``` this will push all your pending commits to the remote server and you have finished your first contribution!

Product Overview/How to Help
------------

The reason I am sharing the project with everyone is to spark people's interest in how to get started on a software project. I believe firmly that the best way to learn software development is by doing it and only learning the things you need to know when you need to know them.

Software is an ever changing creation. It can start as one thing and blossom into something completely different and wonderful. 

To start the project, my plan is this: 

1. Populate the Database with a shit ton of movies from ranker. DB is mysql
2. Build a RESTful API out of the SLIM framework that accesses or DB and returns it to out client gracefully.
3. Build out client side view and service layers using Angular2.

My reasoning behind these choices:
1. We need data. Mysql is easy, fast, cheap to host and works well with PHP.
2. PHP is the cheapest to host, Its ugly, but things can be built quick and dirty with it.
3. Angular2 is by far the best frontend framework right now. IMHO. 

All of the contributors are very new to all of these technologies but I think it would be a fun way to learn them all If you are interested. There are plenty of great tutorials online. A good place to start is with Angular.io and their quickstart guide.

A good Text editor that I would recommend is visual studio code. You can download it here: 
```
https://code.visualstudio.com/
```

