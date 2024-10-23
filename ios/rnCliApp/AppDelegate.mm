#import "AppDelegate.h"
#import "RNBootSplash.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"rnCliApp";
  // Initialize Firebase  
    [FIRApp configure];  

  // Register for remote notifications  
  if (@available(iOS 10.0, *)) {
      [UNUserNotificationCenter currentNotificationCenter].delegate = self;  
      UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |  
                                          UNAuthorizationOptionSound |  
                                          UNAuthorizationOptionBadge;  
      [[UNUserNotificationCenter currentNotificationCenter]  
          requestAuthorizationWithOptions:authOptions  
          completionHandler:^(BOOL granted, NSError * _Nullable error) {  
              // Handle errors here  
          }];  
  } else {  
      UIUserNotificationType allNotificationTypes =  
      (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);  
      UIUserNotificationSettings *settings =  
      [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];  
      [application registerUserNotificationSettings:settings];  
  }  

  [application registerForRemoteNotifications];  

  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Handle the device token reception  
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {  
    [FIRMessaging messaging].APNSToken = deviceToken;  
}

// Handle errors in notification registration  
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {  
    NSLog(@"Unable to register for remote notifications: %@", error);  
}

// For iOS 10 and later, handle incoming messages  
- (void)userNotificationCenter:(UNUserNotificationCenter *)center  
      willPresentNotification:(UNNotification *)notification  
      withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {  
    NSDictionary *userInfo = notification.request.content.userInfo;  

    if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {  
        [FIRMessaging.messaging appDidReceiveMessage:userInfo];  
    }  

    completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);  
} 

// Handle background and foreground messages  
- (void)userNotificationCenter:(UNUserNotificationCenter *)center  
didReceiveNotificationResponse:(UNNotificationResponse *)response  
      withCompletionHandler:(void(^)(void))completionHandler {  
    NSDictionary *userInfo = response.notification.request.content.userInfo;  

    if ([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {  
        [FIRMessaging.messaging appDidReceiveMessage:userInfo];  
    }  

    completionHandler();  
} 

- (void)customizeRootView:(RCTRootView *)rootView {
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView]; // ⬅️ initialize the splash screen
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
