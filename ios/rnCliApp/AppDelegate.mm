#import "AppDelegate.h"
#import "RNBootSplash.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <RNCallKeep/RNCallKeep.h>
#import <PushKit/PushKit.h>
#import "RNFBMessagingModule.h"
#import "RNVoipPushNotificationManager.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Application did finish launching");  

  // Initialize Firebase  
    [FIRApp configure];  
    [RNCallKeep setup:@{
      @"appName": @"InfinitalkPhone",
      @"maximumCallGroups": @3,
      @"maximumCallsPerCallGroup": @1,
      @"supportsVideo": @NO,
    }];

  self.moduleName = @"rnCliApp";
  self.initialProps = @{};
    
  [RNVoipPushNotificationManager voipRegistration];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Successfully registered for remote notifications"); 
  [FIRMessaging messaging].APNSToken = deviceToken;
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

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler {
  return [RNCallKeep application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

#pragma mark - PushKit

// updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(NSString *)type {
  NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Did update push credentials");  
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

// incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(NSString *)type {
  NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Did receive incoming push payload"); 
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {  
    NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Received incoming push with payload"); 
    NSString *uuid = [[[NSUUID UUID] UUIDString] lowercaseString];  
    NSString *callerName = @"Caller Name";  
    NSString *handle = @"Caller Handle";  

    [RNVoipPushNotificationManager addCompletionHandler:uuid completionHandler:completion];  
    [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
    NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Processed incoming push payload");  
  
    // Assuming you have a method to send SIP messages  
    NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Attempting to send 180 Ringing signal to Asterisk");
    // Assuming you have a method to send SIP messages  
    [self sendSIP180RingingWithUUID:uuid completion:^{  
        NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Successfully sent 180 Ringing to Asterisk");  

        // Report call to CallKit  
        [RNCallKeep reportNewIncomingCall: uuid  
                                   handle: handle  
                               handleType: @"generic"  
                                 hasVideo: NO  
                      localizedCallerName: callerName  
                          supportsHolding: YES  
                             supportsDTMF: YES  
                         supportsGrouping: YES  
                       supportsUngrouping: YES  
                              fromPushKit: YES  
                                  payload: nil  
                    withCompletionHandler:^{  
              NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Reported new incoming call to CallKit");  
              completion(); // Finish the task  
              NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Completion handler called, task finished");  
          }];  
    }];  
}

// Simulated method for sending SIP 180 Ringing  
- (void)sendSIP180RingingWithUUID:(NSString *)uuid completion:(void (^)(void))completion {  
    // Simulate network delay  
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{  
        // Simulating sending a SIP message to Asterisk  
        NSLog(@"[DEBUG] 🎁🎁🎁🎁🎁🎁🎁🎁 Sending 180 Ringing for UUID: %@", uuid);  
        // Call the completion to indicate SIP message was sent  
        completion();  
    });  
} 

- (void)customizeRootView:(RCTRootView *)rootView {
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView]; // ⬅️ initialize the splash screen
}

@end
