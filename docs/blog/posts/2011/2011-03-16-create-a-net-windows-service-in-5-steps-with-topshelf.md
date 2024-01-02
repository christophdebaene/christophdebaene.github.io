---
title: Create a .NET Windows Service in 5 steps with Topshelf
date: 2011-03-16
tags: 
  - services
---

[Topshelf](http://topshelf-project.com/) is an open-source hosting framework for building Windows Services using .NET. With Topshelf you can create in a few lines of code your own windows service. It's a kind of internal [DSL](http://martinfowler.com/bliki/DomainSpecificLanguage.html) for building windows services. I used version **2.2** of Topshelf and the binaries and sources can be found [here](https://github.com/topshelf/topshelf) (GitHub).

First download Topshelf from GitHub, I used version 2.2 ([direct link](https://github.com/downloads/Topshelf/Topshelf/Topshelf.v2.2.0.0.zip)).

1. Create a **console application** named `SampleWindowsService` inside Visual Studio - Be sure to change the target framework to .NET Framework 4
2. **Reference** the **binaries** `TopShelf.dll` and `log4net.dll` (included in Topshelf).
3. **Create** a simple **service** called 'SampleService' that simply write every 5 seconds to the log. Note that we create explicit a `Start` and `Stop` method which is conceptually the minimum that a windows service need.

    ```csharp
    public class SampleService
    {
        private Timer _timer = null;
        readonly ILog _log = LogManager.GetLogger(
                                        typeof(SampleService));
    
        public SampleService()
        {
            double interval = 5000;
            _timer = new Timer(interval);
            _timer.Elapsed += new ElapsedEventHandler(OnTick);
        }
    
        protected virtual void OnTick(object sender, ElapsedEventArgs e)
        {
            _log.Debug("Tick:" + DateTime.Now.ToLongTimeString());
        }
    
        public void Start()
        {
            _log.Info("SampleService is Started");
    
            _timer.AutoReset = true;
            _timer.Enabled = true;
            _timer.Start();
        }
    
        public void Stop()
        {
            _log.Info("SampleService is Stopped");
    
            _timer.AutoReset = false;
            _timer.Enabled = false;
        }
    }
    ```

4. In the main method of our console application we will use Topshelf to **host** our _SampleService_. We we are telling Topshelf how to start and stop the service, what the service name is, etc. Note that we need to configure log4net for Topshelf and our service!
    
    ```csharp
    static void Main(string[] args)
    {
        XmlConfigurator.ConfigureAndWatch(
            new FileInfo(".\log4net.config"));
    
        var host = HostFactory.New(x =>
        {
            x.EnableDashboard();
            x.Service(s =>
            {
                s.SetServiceName("SampleService");
                s.ConstructUsing(name => new SampleService());
                s.WhenStarted(tc =>
                {
                    XmlConfigurator.ConfigureAndWatch(
                        new FileInfo(".\log4net.config"));
                    tc.Start();
                });
                s.WhenStopped(tc => tc.Stop());
            });
    
            x.RunAsLocalSystem();
            x.SetDescription("SampleService Description");
            x.SetDisplayName("SampleService");
            x.SetServiceName("SampleService");
        });
    
        host.Run();
    }
    ```
    
5. The only thing we have to do now is to **configure** log4net. Create a file called `log4net.config` with the following configuration.
    
    ```xml title="log4net.config"
    <?xml version="1.0" encoding="utf-8" ?>
    <log4net>
      <appender name="main" type="log4net.Appender.ConsoleAppender">
        <layout type="log4net.Layout.PatternLayout">
          <conversionPattern value="%-5level - %message%newline" />
        </layout>
      </appender>
      <appender name="udp" type="log4net.Appender.UdpAppender">
        <RemoteAddress value="log4view-local"/>
        <RemotePort value="7071"/>
        <layout type="log4net.Layout.XmlLayoutSchemaLog4j"/>
      </appender>
      <root>
        <level value="DEBUG" />
        <appender-ref ref="main" />
        <appender-ref ref="udp" />
      </root>
    </log4net>
    ```
    
    This configuration enables to output to the console and through a [UDP](http://en.wikipedia.org/wiki/User_Datagram_Protocol) network protocol so that we can easily monitor the log statements when installed as a windows service. I used [Log2Console](http://log2console.codeplex.com/) (Codeplex) to monitor my log statements through UDP. 
    
    !!! note 

        Make sure the output directory of `log4net.config` is set to `Copy always`

    !!! note

        Note that there is an [issue](http://www.alteridem.net/2010/07/09/log4net-udpappender-with-ipv6-on-windows-vista-and-7/) with log4net related to IPv6 and Windows Vista/7. You can fix it by adding the following `127.0.0.1 log4view-local` to your hosts file which can be found in folder `C:\Windows\System32\drivers\etc\hosts`.

When you fit ++f5++ you will see that Topshelf outputs some log statements and you will see that the log statements of our SampleService is included and everything is working properly.

![TopshelfConsole](images/topshelfconsole.jpg)

In order to install SampleService as a Windows Service you simply need to do the following through the command prompt.

!!! warning

    Be sure to launch the command prompt as an administrator!

```batch
SampleWindowsService.exe install
```

After that when the windows service has been installed successfully we can start the service through _services.msc_ or simply by typing

```batch
SampleWindowsService.exe start
```

Now we can open Log2Console to monitor our log files that is send through the UDP appender.

![Log2Console](images/log2console.jpg) To uninstall the service we simply write

```batch
SampleWindowsService.exe uninstall
```

The sources can be found [here](https://bitbucket.org/delarou/blogsamples/src/482fbab1bcbe/TopshelfSample/) (BitBucket)
